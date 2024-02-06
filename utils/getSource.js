/**
 * 
 * {
        name: string,
        entryModule: module - 入口模块,
        modules: [{ 
            id: string - 模块id,
            dependencies: string - 依赖的模块绝对路径,
            _source: string - 源代码
        }]
 * }
 * @param {*} chunks
 * @returns 
 */
function getSource(chunk) {
  return `
    (() => {
        var modules = {
          ${chunk.modules
            .map(
              (module) => `
                "${module.id}": (module, exports, require) => {
                    ${module._source}
                }
            `
            )
            .join(",")}
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
          ${chunk.entryModule._source}
        })();
      })();
    `;
}

module.exports = getSource;
