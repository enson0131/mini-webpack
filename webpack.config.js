const path = require("path");
const RunPlugin = require("./plugins/run.plugin");
const DonePlugin = require("./plugins/done.plugin");
module.exports = {
  mode: "production",
  content: process.cwd(), // current working directory 当前的工作目录
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
  },
  plugins: [new RunPlugin(), new DonePlugin()],
};
