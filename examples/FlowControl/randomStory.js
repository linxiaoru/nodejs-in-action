const fs = require('fs');
const request = require('request');
const htmlparser = require('htmlparser');
const configFilename = './rss_feeds.txt';

// 确保包含 RSS 预定源 URL 列表的文件存在
function checkoutForRSSFile() {
  fs.exists(configFilename, function (exists) {
    if (!exists) {
      return next(new Error('Missing RSS file: ' + configFilename));
    }
    next(null, configFilename);
  });
}

// 读取并解析包含预订源 URL 文件
function readRSSFile(configFilename) {
  fs.readFile(configFilename, (err, feedList) => {
    if (err) {
      return next(err);
    }
    // 将预定源 URL 列表转换为字符串，然后分割成一个数组
    feedList = feedList.toString().replace(/^\s+|\s+$/g, '').split("\n");

    let random = Math.floor(Math.random() * feedList.length);
    next(null, feedList[random]);
  });
}

// 向选定的预定源发送 HTTP 请求以获取数据
function downloadRSSFeed(feedUrl) {
  request({ uri: feedUrl }, (err, res, body) => {
    if (err) {
      return next(err);
    }
    if (res.statusCode != 200) {
      return next(new Error('Abnormal response status code'));
    }
    next(null, body);
  });
}

// 将预定源数据解析到一个条目数组中
function parseRSSFeed(rss) {
  let handler = new htmlparser.RssHandler();
  let parser = new htmlparser.Parser(handler);
  parser.parseComplete(rss);
  if (!handler.dom.items.length) {
    return next(new Error('No RSS items found'));
  }
  // 如果有数据，显示第一个预定源条目的标题和 URL
  let item = handler.dom.items.shift();
  console.log(item.title);
  console.log(item.link);
}

// 把所有要执行的任务按执行顺序添加到数组中
let tasks = [
  checkoutForRSSFile,
  readRSSFile,
  downloadRSSFeed,
  parseRSSFeed
];

function next(err, result) {
  if (err) {
    throw err;
  }
  // 从任务数组中读取下一个任务
  let currentTask = tasks.shift();
  if (currentTask) {
    currentTask(result);
  }
}
next();