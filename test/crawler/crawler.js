// var cheerio = require('cheerio');
var https = require("https");
var file = require("../../bin/helper/file.js");

var url = 'https://www.zhihu.com/explore';

https.get(url, function (res) {
    var html = '';
    res.on('data', function (data) {
        html += data;
    }).on('end', function () {
        file.saveFile(html,'./test/crawler/file/zhihuExplore.html','utf-8');
    })
});