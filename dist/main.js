
    (() => {
        var modules = {
          
                "./src/index.js": (module, exports, require) => {
                    const title = require("./src/title.js");
console.log(`title`, title);
// 2// 1
                }
            ,
                "./src/title.js": (module, exports, require) => {
                    module.exports = "enson1";
// 2// 1
                }
            
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
          const title = require("./src/title.js");
console.log(`title`, title);
// 2// 1
        })();
      })();
    