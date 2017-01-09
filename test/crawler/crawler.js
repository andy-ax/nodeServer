var cheerio = require('cheerio');
var https = require("https");
var file = require("../../bin/helper/file.js");

var url = 'https://www.zhihu.com/explore';

https.get(url, function (res) {
    var html = [];
    res.on('data', function (data) {
        html.push(data);
    }).on('end', function () {
        loadEnd();

        var buf = new Buffer(Buffer.concat(html), 'utf-8');
        var str = buf.toString('utf-8');

        var config = {
            anchor: '.anchor',
            tabPanel: {
                index: '.tab-panel',
                child: {
                    feedItem: {
                        index: '.feed-item',
                        child: {
                            jsVoteCount: '.js-vote-count',
                            jsToggleCommentBox: '.js-toggleCommentBox',
                            questionLink: '.question_link',
                            authorLinkLine: '.author-link-line',
                            content: '.content'
                        }
                    }
                }
            }
        };
        var text = getText(config,str);
        analyzeEnd();

        saveFile2Json(text,'./test/crawler/file/zhiHuHot','utf-8',function () {
            saveEnd();
        },function () {
            saveErr();
        });
    }).on('error', function () {
        loadErr();
    })
});

/*
 * {
 *  title: id
 *  context: {
 *      index: id||class
 *      child: [
 *          c1: id,
 *          c2: class,
 *          c3: {
 *              index: class
 *              child:[]
 *          }
 *      ]
 *  }
 * }
 */
function getText(config, html, root) {
    var $ = cheerio.load(html);

    var text = {};
    root = root || 'body';
    deepLoad(config,text,$(root));
    return text;
}

function deepLoad(obj, fatherObj, father) {
    for (var i in obj) {
        if (obj[i] instanceof Object) {
            var thisFather = father.find(obj[i].index);
            fatherObj[i] = [];
            for (var j = 0,len = thisFather.length; j < len; j++) {
                var arr = {};
                deepLoad(obj[i].child, arr, thisFather.eq(j));
                fatherObj[i].push(arr);
            }
        } else {
            var textElement = father.find(obj[i]);
            if (textElement.length > 1) {
                fatherObj[i] = [];
                for (var j = 0,len = textElement.length; j < len; j++) {
                    fatherObj[i].push(textElement.eq(j).text());
                }
            } else {
                fatherObj[i] = textElement.text();
            }
        }
    }
}

function obj2Html(obj, config) {

}

function saveFile2Json(path, obj, encode, resolve, reject) {
    file.saveFile(JSON.stringify(obj), path + '.json', encode, resolve, reject);
}

function saveFile2Html(path, obj, encode, config, resolve, reject) {

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