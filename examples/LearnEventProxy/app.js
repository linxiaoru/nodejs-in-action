// 引入模块
const cheerio = require('cheerio');
const superagent = require('superagent');
const eventproxy = require('eventproxy');
// 引入 Node.js 标准库里的 url 模块
const url = require('url');
const cnodeUrl = 'https://cnodejs.org/';

superagent.get(cnodeUrl)
  .end(function (err, res) {
    if (err) {
      return console.error(err);  // 错误处理
    }

    let topicUrls = [];
    const $ = cheerio.load(res.text);

    // 获取首页所有的链接
    $('#topic_list .topic_title').each(function (idx, element) {
      const $element = $(element);
      // 使用 url.resolve 来自动推断出完整 url
      let href = url.resolve(cnodeUrl, $element.attr('href'));
      topicUrls.push(href);
    });

    console.log(topicUrls);

    // 创建一个 eventproxy 实例
    const ep = new eventproxy();

    // 命令 ep 重复监听 topicUrls.length 次 topic_html 事件再行动
    ep.after('topic_html', topicUrls.length, function (topics) {
      // 行动
      topics = topics.map(function (topicPair) {
        let topicUrl = topicPair[0];
        let topicHtml = topicPair[1];
        let $ = cheerio.load(topicHtml);
        return ({
          title: $('.topic_full_title').text().trim(),
          href: topicUrl,
          comment1: $('reply_content').eq(0).text().trim()
        });
      });

      console.log('final:', topics);
    });

    topicUrls.forEach(function (topicUrl) {
      superagent.get(topicUrl)
        .end(function (err, res) {
          console.log('fetch ' + topicUrl + ' successful');
          ep.emit('topic_html', [topicUrl, res.text]);
        });
    });
  });