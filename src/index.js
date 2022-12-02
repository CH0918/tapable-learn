const {
  SyncHook,
  SyncBailHook,
  SyncWaterfallHook,
  SyncLoopHook,
  AsyncParallelHook,
  AsyncParallelBailHook,
  AsyncSeriesHook,
  AsyncSeriesBailHook,
  AsyncSeriesWaterfallHook,
} = require('tapable');

// 同步按顺序执行
const syncHook = new SyncHook(['a', 'b']);
syncHook.tap('hdj2', (c) => {
  console.log('tap2=', c);
});
syncHook.tap('hdj', (a, b) => {
  console.log('tap1=', a, b);
});
// syncHook.call(1, 2);

// 返回非undefined 就继续往下执行
const syncBailHook = new SyncBailHook(['a', 'b']);
syncBailHook.tap('f2', (a, b) => {
  console.log('f2 = ', a, b);
  return;
});
syncBailHook.tap('f1', (a, b) => {
  console.log('f1 = ', a, b);
  return true;
});
// syncBailHook.call(3, 4);

// 参数传递
const waterHook = new SyncWaterfallHook(['a']);
waterHook.tap('f3', (a) => {
  console.log('f3 = ', a);
  return 'f3';
});
waterHook.tap('f4', (a) => {
  console.log('f4 = ', a);
  return;
});
// waterHook.call(1);

// 循环一直到全都返回undefinded
let count = 0;
const loopHook = new SyncLoopHook(['a']);
loopHook.tap('a', (a) => {
  console.log('a');
  return undefined;
});
loopHook.tap('b', (a) => {
  console.log('b');
  count++;
  if (count < 5) {
    return true;
  } else {
    return undefined;
  }
});

loopHook.tap('c', (a) => {
  console.log('c');
  return undefined;
});
// loopHook.call(1);
// 所有的异步钩子按顺序执行完后通过callback来控制异步的执行，相当于promise的resolve，callback传了参数相当于reject
// 初始化同步钩子
// const hook = new AsyncSeriesHook(['arg1', 'arg2', 'arg3']);

// console.time('timer');

// // 注册事件
// hook.tapAsync('flag1', (arg1, arg2, arg3, callback) => {
//   console.log('flag1:', arg1, arg2, arg3);
//   setTimeout(() => {
//     console.log('111');
//     // 1s后调用callback表示 flag1执行完成
//     callback(11);
//     console.log('444444444');
//   }, 3000);
// });
// hook.tapAsync('flag3', (arg1, arg2, arg3, callback) => {
//   console.log('flag3:', arg1, arg2, arg3);
//   // tapPromise返回Promise
//   setTimeout(() => {
//     console.log('333');
//     callback();
//   }, 2000);
// });
// hook.tapPromise('flag2', (arg1, arg2, arg3) => {
//   console.log('flag2:', arg1, arg2, arg3);
//   // tapPromise返回Promise
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       console.log('222');
//       resolve();
//     }, 1000);
//   });
// });

// // 调用事件并传递执行参数
// hook.callAsync('19Qingfeng', 'wang', 'haoyu', (a) => {
//   console.log('全部执行完毕 done', a);
//   console.timeEnd('timer');
// });

// 初始化同步钩子
// const hook = new AsyncSeriesBailHook(['arg1', 'arg2', 'arg3']);

// console.time('timer');

// // 注册事件
// hook.tapPromise('flag1', (arg1, arg2, arg3, callback) => {
//   console.log('flag2:', arg1, arg2, arg3);
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       // resolve函数存在任何值表示存在返回值
//       // 存在返回值 bail保险打开 中断后续执行
//       resolve(undefined);
//     }, 1000);
//   });
// });

// // flag2 不会被执行了
// hook.tapAsync('flag2', (arg1, arg2, arg3, callback) => {
//   console.log('flag1:', arg1, arg2, arg3);
//   setTimeout(() => {
//     callback();
//   }, 1000);
// });

// // 调用事件并传递执行参数
// hook.callAsync('19Qingfeng', 'wang', 'haoyu', () => {
//   console.log('全部执行完毕 done');
//   console.timeEnd('timer');
// });

// 初始化同步钩子
// const hook = new AsyncParallelHook(['arg1', 'arg2', 'arg3']);

// console.time('timer');

// // 注册事件
// hook.tapPromise('flag1', (arg1, arg2, arg3) => {
//   console.log('flag2:', arg1, arg2, arg3);
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve(true);
//     }, 1000);
//   });
// });

// hook.tapAsync('flag2', (arg1, arg2, arg3, callback) => {
//   console.log('flag1:', arg1, arg2, arg3);
//   setTimeout(() => {
//     callback();
//   }, 1000);
// });

// // 调用事件并传递执行参数
// hook.callAsync('19Qingfeng', 'wang', 'haoyu', () => {
//   console.log('全部执行完毕 done');
//   console.timeEnd('timer');
// });

// 初始化同步钩子
const hook = new AsyncParallelBailHook(['arg1', 'arg2', 'arg3']);

console.time('timer');

// 注册事件
hook.tapPromise('flag1', (arg1, arg2, arg3) => {
  return new Promise((resolve, reject) => {
    console.log('flag1 done:', arg1, arg2, arg3);
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
});

hook.tapAsync('flag2', (arg1, arg2, arg3, callback) => {
  setTimeout(() => {
    console.log('flag2 done:', arg1, arg2, arg3);
    callback();
  }, 3000);
});

hook.callAsync('19Qingfeng', 'wang', 'haoyu', () => {
  console.log('全部执行完毕 done');
  console.timeEnd('timer');
});
