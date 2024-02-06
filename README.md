# mini-webpack

手写 webpack

## 编译过程
- 1. 初始化参数：获取配置文件和命令行的参数，初始化参数
- 2. 开始编译：通过获取的参数，初始化 Compiler 对象，获取插件配置，执行插件的 apply 方法
- 3. 确定入口文件：根据配置文件的 entry 确定入口文件
- 4. 编译模块：从入口文件出发，通过配置的 loader 加载解析该模块，递归子模块，得到所有模块的编译结果和模块关系网图
- 4. 组合 chunk：根据入口与模块之间的关联关系，组转成一个个包含多模块的 Chunk，再把每个 Chunk 转化成单独的文件加入到输出列表中
- 5. 输出完成：根据输出的文件名和目录输出产物


## 一些细节

### 如何找出模块依赖的模块

通过 AST 

![AST](./public/image/1.png)

### 输出的结果

```js
(() => {
  var modules = {
    "./src/title.js": (module) => {
      module.exports = "enson1";
    },
  };
  // The module cache
  var cache = {};

  // The require function
  function require(moduleId) {
    // Check if module is in cache
    var cachedModule = cache[moduleId];
    if (cachedModule !== undefined) {
      return cachedModule.exports;
    }
    // Create a new module (and put it into the cache)
    var module = (cache[moduleId] = {
      // no module.id needed
      // no module.loaded needed
      exports: {},
    });

    // Execute the module function
    modules[moduleId](module, module.exports, require);

    // Return the exports of the module
    return module.exports;
  }

  var __webpack_exports__ = {};
  // This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
  (() => {
    const title = require(/*! ./title */ "./src/title.js");
    console.log(`title`, title);
  })();
})();

```

## 参考网址
- https://www.astexplorer.net/ - 将代码转化成 AST

