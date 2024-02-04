const path = require("path");
const RunPlugin = require("./plugins/run.plugin");
const DonePlugin = require("./plugins/done.plugin");
module.exports = {
  mode: "production",
  context: process.cwd(), // current working directory 当前的工作目录
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          // 'logger1-loader',
          // 'logger2-loader',
          // 'babel-loader',
          path.resolve(__dirname, "loaders", "logger1.loader.js"),
          path.resolve(__dirname, "loaders", "logger2.loader.js"),
        ],
      },
    ],
  },
  plugins: [new RunPlugin(), new DonePlugin()],
};
