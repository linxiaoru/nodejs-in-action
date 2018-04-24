// 引入依赖
let express = require('express');
let cheerio = require('cheerio');
let superagent = require('superagent');

// 创建 express 实例
let app = express();

app.get('/', function (req, res, next) {
  // 用 superagent 去抓取 http://cnodejs.org 的内容
  superagent.get('http://cnodejs.org/')
    .end(function (err, sres) {
      // 常规的错误处理
      if (err) {
        return next(err);
      }

      // sres.text 里面存储着网页的 html 内容，将它传给 cheerio.load 之后就可以得到一个实现 jquery 接口的变量
      // 习惯性地将它命名为 '$'

      let $ = cheerio.load(sres.text);
      var items = [];
      $('#topic_list .topic_title').each(function (idx, element) {
        let $element = $(element);
        items.push({
          title: $element.attr('title'),
          href: $element.attr('href')
        });
      });

      res.send(items);
    });
});

app.listen(3000, function () {
  console.log('app is listening at port 3000');
});