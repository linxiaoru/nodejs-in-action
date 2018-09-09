const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  getTitles(res);
}).listen(8000, "127.0.0.1");

function getTitles(res) {
  fs.readFile('./title.json', (err, data) => {
    if (err) {
      return handleError(err, res);
    }
    getTemplate(JSON.parse(data.toString()), res);
  })
}

function getTemplate(titles, res) {
  fs.readFile('./template.html', (err, data) => {
    if (err) {
      return handleError(err, res);
    } 
    formateHtml(titles, data.toString(), res);
  })
}

function formateHtml(titles, tmpl, res) {
  let html = tmpl.replace('%', titles.join('<li></li>'));
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(html);
}

function handleError(err, res) {
  console.error(err);
  res.end('Server Error');
}