// 引入依赖
let express = require('express');
let utility = require('utility');

// 创建 express 实例
let app = express();

app.get('/', function (req, res) {
  // 从 req.query 中取出我们的 q 参数，如果没有该参数则默认设置为 Cheryl
  let q = req.query.q || 'Cheryl'; 

  // 将 q 转换为 md5 值和 sha1 值
  let md5Value = utility.md5(q);
  let sha1Value = utility.sha1(q);

  // 使用 res 对象向浏览器输出的这两个值
  res.send(`md5Value: ${md5Value}  sha1Value: ${sha1Value}`);
});

// 监听本地的 3000 端口
app.listen(3000, function (req, res) {
  console.log('app is running at port 3000');
})