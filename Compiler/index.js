const { SyncHook } = require("tapable");
const path = require("path");
const fs = require("fs");
const types = require("babel-types"); // 操作工具
const parser = require("@babel/parser"); // 将源代码转化成 AST
const traverse = require("@babel/traverse").default; // 操作 AST
const generator = require("@babel/generator").default; // 将 AST 转化成源代码
const getSource = require("../utils/getSource");

class Compiler {
  constructor(options) {
    this.options = options;
    this.hooks = {
      run: new SyncHook(), // 会在开始编译的时候触发
      done: new SyncHook(), // 会在完成编译的时候触发
    };
    /*
    {
      id: String, // 模块id
      dependencies: String[], 依赖的路径
      _source: String; // 源代码
    }
    */
    this.modules = []; // 这里存放所有的模块
    this.chunks = []; // webpack5  -> this.chunks = new Set();
    this.assets = {}; // 输出列表，存放将要输出的文件
  }

  run() {
    this.hooks.run.call(); // 当调用 run 方法的时候，会触发 run 这个钩子，进而执行它的回调函数
    // 中间就是编译过程
    this.compile();
    this.hooks.done.call();
  }

  compile() {
    const flow = [
      this.getEntryFile.bind(this),
      this.buildModule.bind(this),
      this.buildChunk.bind(this),
      this.buildFile.bind(this),
    ];
    return flow.reduce((pre, cur) => {
      return cur(pre);
    }, null);
  }

  // 5. 确定入口: 根据配置文件中的 entry 确定入口文件
  getEntryFile() {
    const entry = path.join(this.options.context, this.options.entry);
    return entry;
  }

  /**
   * 6. 编译模块：从入口文件出发，调用所有配置的 Loader 对模块进行编译，
     再找出该模块依赖的模块，得到了每个模块被编译后的 最终内容 以及他们之间的 依赖关系图；
     编译模块:
        - 1. 读取模块文件
        - 2. 调用配置的 loader 对模块进行编译
        - 3. 通过 AST 递归子模块，获取子模块，并对子模块进行编译
        - 4. 通过 modules 存储每个模块，得到模块的最终内容和他们之间的 依赖关系图
   * @param {*} modulePath 
   * @return 返回编译修改后的 module
   */
  buildModule(modulePath) {
    let originSourceCode = fs.readFileSync(modulePath, "utf-8");

    const rules = this.options.module.rules;

    let loaders = [];

    for (let i = 0; i < rules.length; i++) {
      if (rules[i].test.test(modulePath)) {
        loaders = [...loaders, ...rules[i].use];
      }
    }

    // loader 是从右往左执行
    loaders.reverse().forEach((loader) => {
      originSourceCode = require(loader)(originSourceCode);
    });

    let moduleId = this.getModuleId(modulePath);

    // 每个文件都是一个模块
    let module = {
      id: moduleId, // 模块id
      dependencies: [], // 依赖的数组
    };

    // 通过 AST 获取子模块
    const ast = parser.parse(originSourceCode, { sourceType: "module" });

    // 编译语法树
    traverse(ast, {
      CallExpression: ({ node }) => {
        if (node?.callee?.name === "require") {
          let index = -1;
          const extensions = this?.options?.resolve?.extensions || [];
          // 1. 相对路径
          // 2. 相对于当前模块
          const moduleName = node?.arguments[0]?.value;
          let depModulePath = moduleName; // 模块路径
          // if (!path.isAbsolute(moduleName)) {
          // 加上 posix 统一成 unix 格式的分隔符
          const dirname = path.posix.dirname(modulePath); // 获取当前路径所在的目录
          depModulePath = path.posix.join(dirname, moduleName); // 获取子模块的绝对路径
          // }

          while (!fs.existsSync(depModulePath) && index < extensions.length) {
            index++;
            depModulePath = depModulePath + extensions[index];
          }

          // 如果找不到模块，则报错
          if (index >= extensions.length) {
            throw new Error(
              `Module not found: Error: Can not resolve '${moduleName}' in '${dirname}'`
            );
          }

          console.log(`depModulePath--->`, depModulePath);

          // "./src/index.js" - 这个是一个模块 ID
          // 例如 depModulePath = /a/b/c, baseDir = /a/b relative => c
          const depModuleId = this.getModuleId(depModulePath);
          node.arguments = [types.stringLiteral(depModuleId)]; // 修改 AST 的参数，具体可查看 public/2.png
          module.dependencies.push(depModulePath);
        }
      },
    });

    let { code } = generator(ast);

    module._source = code; // 转化后的代码
    this.modules.push(module); // 添加模块
    // 7. 再找出该模块依赖的模块，再递归编译处理
    module?.dependencies?.forEach((dependency) => {
      this.buildModule(dependency);
    });

    return module;
  }

  /**
   * 7. 组合 Chunk: 根据入口文件与各个模块的关联关系，组转成一个包含多模块的 Chunk，等待输出
   */
  buildChunk(entryModule) {
    let chunk = {
      name: "main",
      entryModule, // 入口模块
      modules: this.modules,
    };

    this.chunks.push(chunk);

    // 把每个 Chunk 转化成一个单独的文件加入到输出列表
    this.chunks.forEach((chunk) => {
      // key 是文件名
      // value 是打包后的内容
      this.assets[chunk.name + ".js"] = getSource(chunk);
    });
  }

  /**
   * 根据配置确定好输出的内容后，根据配置确定输出的路径和文件名，把文件内容写在写入到文件系统上
   */
  buildFile() {
    const files = Object.keys(this.assets);
    const dirPath = this.options.output.path;
    const targetPath = path.join(dirPath, this.options.output.filename);

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }

    for (let name of files) {
      fs.writeFileSync(targetPath, this.assets[name]);
    }
  }

  getModuleId(modulePath) {
    const baseDir = this.options.context;
    return "./" + path.posix.relative(baseDir, modulePath);
  }
}

module.exports = Compiler;
