const fs = require('fs');
const events = require('events');
const util = require('util');
const watchDir = './watch'; // 监控的目录
const processedDir = './done';  // 放置修改过的文件的目录

// Watcher 类构造器。
function Watcher(watchDir, processedDir) {
  this.watchDir = watchDir;
  this.processedDir = processedDir;
}

// 继承事件发射器行为，等同于 Watcher.prototype = new events.EventEmitter();
util.inherits(Watcher, events.EventEmitter);

Watcher.prototype.watch = function () {
  let watcher = this;
  fs.readdir(this.watchDir, (err, files) => {
    if (err) {
      throw err;
    }
    for (let index in files) {
      watcher.emit('process', files[index]);
    }
  });
}

Watcher.prototype.start = function () {
  let watcher = this;
  fs.watchFile(watchDir, function () {
    watcher.watch();
  });
}

let watcher = new Watcher(watchDir, processedDir);
watcher.on('process', function process(file) {
  let watchFile = this.watchDir + '/' + file;
  let processedFile = this.processedDir + '/' + file.toLowerCase();

  fs.rename(watchFile, processedFile, function (err) {
    if (err) {
      throw err;
    }
  });
});

watcher.start();

