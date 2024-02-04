const { SyncHook } = require("tapable");
const path = require("path");
const fs = require("fs");

class Compiler {
  constructor(options) {
    this.options = options;
    this.hooks = {
      run: new SyncHook(), // 会在开始编译的时候触发
      done: new SyncHook(), // 会在完成编译的时候触发
    };
  }

  run() {
    this.hooks.run.call(); // 当调用 run 方法的时候，会触发 run 这个钩子，进而执行它的回调函数
    // 中间就是编译过程
    this.compile();
    this.hooks.done.call();
  }

  compile() {
    const flow = [this.getEntryFile, this.buildModule];
    return flow.reduce((pre, cur) => {
      return cur(pre);
    }, null);
  }

  // 5. 根据配置文件中的 entry 确定入口文件
  getEntryFile() {
    const entry = path.join(this.options.context, this.options.entry);
    return entry;
  }

  /**
   * 6. 从入口文件出发，调用所有配置的 Loader 对模块进行编译，
     再找出该模块依赖的模块，得到了每个模块被编译后的 最终内容 以及他们之间的 依赖关系图；
     编译模块:
        - 1. 读取模块文件
   * @param {*} modulePath 
   */
  buildModule(modulePath) {
    const origin = fs.writeFileSync(modulePath, "utf-8");
  }
}

module.exports = Compiler;
