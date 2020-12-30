var cheerio = require('cheerio');
var https = require("http");
var file = require("../../bin/helper/file.js");
var readline = require('readline');
// var request = require('request');

var rl = readline.createInterface(process.stdin,process.stdout);

var url = 'http://www.360doc.com/content/';
rl.question('input url\n',function(answer){
    url += answer;
    console.log(url);
    rl.close();

    https.get(url,function (res) {
        var html = [];
        res.on('data',function (data) {
            html.push(data);
        }).on('end',function () {
            loadEnd();

            var buf = new Buffer(Buffer.concat(html), 'utf-8');
            var str = buf.toString('utf-8');

            var ownUrl = './test/crawler/360doc/';
            var result = rule(str);
            var name = ownUrl+result.title+'.html';
            file.saveFile(result.html,name,'utf-8',function () {
                saveEnd()
            },function (err) {
                saveErr();
            })
        })
    })
});

function rule(html,root) {
    var $ = cheerio.load(html);
    root = root || '#artContent';

    return {
        html: $.html(root),
        title: $('#titiletext').text()
    }
}

function saveEnd() {
    console.log('文件已写入');
}
function saveErr() {
    console.log('文件写入出错');
}
function loadEnd() {
    console.log('网页读取完毕')
}
function loadErr() {
    console.log('网页读取出错')
}
function analyzeEnd() {
    console.log('网页分析完毕')
}