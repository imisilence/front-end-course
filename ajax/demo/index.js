var http = require('http');
var express = require('express');
var fs = require('fs');
var app = express();

var filename = 'news.json';
var newsArray = [];

if (fs.existsSync(filename)) {
  newsArray = JSON.parse(fs.readFileSync(filename));
  console.log('load.');
}

app.use(express.static(__dirname + '/public'));

app.get('/wait/:newsIndex/:delay', function(req, res) {
  var delay = parseInt(req.params.delay);
  var newsIndex = parseInt(req.params.delay);
  setTimeout(function() {
    res.json(newsArray[newsIndex]);
  }, delay);
});

app.get('/page/:pageSize/:pageIndex', function(req, res) {
  var pageIndex = parseInt(req.params.pageIndex);
  var pageSize = parseInt(req.params.pageSize);
  var start = pageIndex * pageSize; // 起始点
  res.json({
    count: newsArray.length,
    news: newsArray.slice(start, start + pageSize)
  });
});

app.get('/search/:pageSize/:pageIndex', function(req, res) {
  var key = req.query.q;
  var pageIndex = parseInt(req.params.pageIndex);
  var pageSize = parseInt(req.params.pageSize);
  var start = pageIndex * pageSize; // 起始点
  var searchArray = newsArray.filter(function(item) {
    return item.title.indexOf(key) >= 0;
  });

  res.json({
    count: searchArray.length,
    news: searchArray.slice(start, start + pageSize)
  });
});

var port = 2014;
var server = http.createServer(app);
server.listen(port);
console.log("listen port: %d", port);
