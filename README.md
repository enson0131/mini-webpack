# mini-webpack

手写 webpack

## 编译过程
- 1. 初始化参数：获取配置文件和命令行的参数，初始化参数
- 2. 开始编译：通过获取的参数，初始化 Compiler 对象，获取插件配置，执行插件的 apply 方法
- 3. 确定入口文件：根据配置文件的 entry 确定入口文件
- 4. 编译模块：从入口文件出发，通过配置的 loader 加载解析该模块，递归子模块，得到所有模块的编译结果和模块关系网图
- 4. 输出资源：根据入口与模块之间的关联关系，组转成一个个包含多模块的 Chunk，再把每个 Chunk 转化成单独的文件加入到输出列表中
- 5. 输出完成：根据输出的文件名和目录输出产物


## 一些细节

### 如何找出模块依赖的模块

通过 AST 

![AST](./public/image/1.png)

## 参考网址
- https://www.astexplorer.net/ - 将代码转化成 AST

