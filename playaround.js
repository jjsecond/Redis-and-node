// node has import
const { EventEmitter } = require("events");

// good for cpu intensive tasks
const eventEmitter = new EventEmitter();

eventEmitter.on("lunch", () => {
  console.log("yum");
});

eventEmitter.emit("lunch")

global.luckyNum = "23";

console.log(global.luckyNum);

console.log(process.platform);
