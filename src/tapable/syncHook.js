// let { SyncHook } = require("tapable");

// class SyncHook {
//     constructor() {
//         this.taps = [];
//     }
//     tap(name, fn) {
//         this.taps.push(fn);
//         return () => {
//             this.remove(name, fn);
//         }
//     }
//     call(name, ...args) {
//         this.taps[name].forEach(fn => {
//             fn(...args);
//         })

//     }
//     remove(name, fn) {
//         this.taps[name] = this.taps[name].forEach(cb => cb !== fn);
//     }
// }

class SyncHook {
  constructor(...args) {
    this._args = args;
    this.taps = [];
  }
  tap(name, fn) {
    this.taps.push(fn);
  }
  call(...args) {
    this.taps.forEach((tap) => {
      tap(...args.slice(0, this._args.length));
    });
  }
}

let syncHook = new SyncHook(["name"]); // 感觉有点类似于 tapable 想让开发人员强制写注释的意思。。

// 类似于 EventEmitter, 但 EventEmitter 用事件名称区分，tapable 用 实例hook 区分。
syncHook.tap("这个名字没有什么用，只是给程序员看的", (name) => {
  console.log(name, "这是一个回调");
});

syncHook.tap("这个名字没有什么用，只是给程序员看的1", (name) => {
  console.log(name, "这是一个回调1");
});

syncHook.call("enson");
