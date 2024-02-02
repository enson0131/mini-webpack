const EventEmitter = require("events").EventEmitter;
const eventEmitter = new EventEmitter();

eventEmitter.on("a", () => {
  console.log(`a`);
});

eventEmitter.on("b", () => {
  console.log(`b`);
});

eventEmitter.emit("a"); // 会根据事件名成区分，只会打印a
