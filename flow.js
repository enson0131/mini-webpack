const webpack = require("./webpack");
const options = require("./webpack.config.js");

// 根据获取的参数，初始化 Compiler 对象
const Compiler = webpack(options);
