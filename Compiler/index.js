const { SyncHook } = require("tapable");

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
    // TODO... 中间就是编译过程
    this.hooks.done.call();
  }

  done() {}
}

module.exports = Compiler;
