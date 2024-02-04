class DonePlugin {
  constructor(options) {
    this.options = options;
  }
  // 每个插件定死了一个 apply 方法
  apply(compiler) {
    // 监听感兴趣的钩子，注册监听函数
    compiler.hooks.done.tap("DonePlugin", () => {
      console.log("Done～～～～～");
    });
  }
}

module.exports = DonePlugin;
