let Compiler = require("../Compiler");

/**
 * @param {*} options
 */
function webpack(options) {
  const pipeFlow = [initOptions, initCompiler, initPlugin];

  const result = pipeFlow.reduce((pre, cur) => {
    return cur(pre);
  }, options);

  return result.compiler;
}

// 1 初始化参数: 从配置文件和 Shell 语句中读取合并参数，得到最终的配置对象
function initOptions(options) {
  // process.argv 可以获取 shell 语句的参数
  console.log(process.argv);
  const shellOptions =
    process.argv?.slice(2)?.reduce((pre, cur) => {
      let [key, value] = cur.split("="); // [--mode, production]
      return {
        ...pre,
        [key.slice(2)]: value,
      };
    }, {}) || {};

  const finalOptions = Object.assign({}, options, shellOptions);

  return {
    finalOptions,
  };
}

// 根据上一步获取的参数初始化 Compiler 对象
function initCompiler(preRes) {
  const { finalOptions: options } = preRes;
  return {
    ...preRes,
    compiler: new Compiler(options),
  };
}

/**
 * 加载所有配置的插件
 * Webpack 会在特定的时间点广播出特定的事件，插件会监听到对应的事件后执行特定的逻辑，并且插件可以调用
 * Webpack 的 API 改变 Webpack 的运行结果
 */
function initPlugin(preRes) {
  const { finalOptions, compiler } = preRes;
  finalOptions?.plugins?.forEach((plugin) => {
    plugin.apply(compiler);
  });
  return preRes;
}

module.exports = webpack;
