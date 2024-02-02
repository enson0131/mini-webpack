let Compiler = require("./Compiler");

/**
 * @param {*} options
 */
function webpack(options) {
  const pipeFlow = [initOptions, initCompiler];

  return pipeFlow.reduce((pre, cur) => {
    return cur(pre);
  }, options);
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

  console.log(`shellOptions---->`, shellOptions);

  const finalOptions = Object.assign({}, options, shellOptions);

  return finalOptions;
}

// 根据上一步获取的参数初始化 Compiler 对象
function initCompiler(options) {}

module.exports = webpack;
