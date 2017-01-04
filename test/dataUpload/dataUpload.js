var http = require('http');
var querystring = require("querystring");
var xml2js = require('xml2js');
var formidable = require('formidable');

var parseMod = require('../../bin/helper/parse').parse;
var fileMod = require('../../bin/helper/file');
var handle404 = require("../../bin/helper/handel404.js").handle404;

console.time('connect time');
http.createServer(onRequest).listen(23001,function () {
    console.timeEnd('connect time');
});

function onRequest(req, res) {
    req.urlObj = parseMod(req.url);
    if(hasBody(req)) {
        var bufs = [];
        req.on('data', function (chunk) {
            bufs.push(chunk);
        });
        req.on('end', function () {
            req.rawBody = Buffer.concat(bufs).toString();
            handle(req, res);
        })
    } else {
        if (req.urlObj.pathname === '/') {
            fileMod.readFile('./test/dataUpload/index.html', function (file) {
                res.writeHeader(200, 'OK');
                res.end(file);
            })
        } else {
            fileMod.readFile('./public' + req.urlObj.pathname, function (file) {
                res.writeHeader(200, 'OK');
                res.end(file);
            },function (err) {
                handle404(res);
            });
        }
    }
}

function handle(req, res) {
    //表单数据
    var end;
    if (req.headers['content-type'].indexOf('application/x-www-form-urlencoded') > -1 && req.urlObj.pathname === '/queryString') {
        req.body = querystring.parse(req.rawBody);
        console.log(req.body);
        end = '后端已经获得数据';
        res.writeHeader(200, 'OK');
        res.end(end);
    } else if (req.headers['content-type'].indexOf('application/json') > -1 && req.urlObj.pathname === '/json') {
        req.body = JSON.parse(req.rawBody);
        console.log(req.body);
        end = {length:4,text:['abc','def','ghi','jkl']};
        end = JSON.stringify(end);
        res.writeHeader(200, 'OK');
        res.end(end);
    } else if (req.headers['content-type'].indexOf('application/xml') > -1 && req.urlObj.pathname === '/xml') {
        xml2js.parseString(req.rawBody, function (err, xml) {
            if (err) {
                res.writeHeader(400);
                res.end('Invalid XML');
                return;
            }
            req.body = xml;
            console.log('req.body');
            res.writeHeader(200, 'OK');
            res.end(end);
        })
    } else if (req.headers['content-type'].indexOf('multipart/form-data') > -1 && req.urlObj.pathname === '/upload') {
        // var form = new formidable.IncomingForm();
        // form.encoding = 'utf-8';
        // form.uploadDir = './test/dataUpload/';
        // form.keepExtensions = true;
        // form.maxFieldsSize = 2 * 1024 * 1024;
        // form.type = true;
        // var displayUrl;
        // form.parse(req, function (err, fields, files) {
        //     if (err) {
        //         console.log(err);
        //         return;
        //     }
        //     console.log(files);
        //     res.writeHeader(200, 'OK');
        //     res.end(end);
        // })
        fileUploadParse(req.rawBody, './test/dataUpload/', function () {

        })
    }
}

var hasBody = function(req) {
    return 'transfer-encoding' in req.headers || 'content-length' in req.headers;
};

var fileUploadParse = function (str, filepath, cb) {
    //获取模块分割字符串
    var expModule = /^([^\r\n]+)\r\n/;
    var header = expModule.exec(str);
    //分割模块
    var sp = '\r\n' + header[1] + '--';
    if (str.indexOf(sp) > -1) {
        str = str.replace(sp, '');//去除尾部
    }
    var resArr = str.split(header[0]);//分割数组
    resArr.shift();//去除头部

    //分割头与体
    var bodyArr = [];
    resArr.forEach(function (str) {
        var arr = /^([\w\W]+?)\r\n\r\n([\w\W]+)$/.exec(str);
        var head = arr[1];
        var body = arr[2];

        body.length -= 2;

        //file判断
        var file;
        if (head.indexOf('Content-Type') > -1) {
            file = true;
        }
        head = head.replace(/Content-Type: ([^\r\n]+)($|\r\n)/,'')
            .replace(/\r\n/g, '')
            .replace(/\s+/g, '')
            .replace('Content-Disposition:form-data;', '')
            .replace(/\"/g,'');
        head = querystring.parse(head, ';', '=');

        //file处理
        if (file) {
            body = new Buffer(body);
            fileMod.saveFile(body, filepath + head.filename, 'utf-8',function () {
                bodyArr.push({
                    head: head,
                    body: filepath + head.filename
                });
            });
        } else {
            bodyArr.push({
                head: head,
                body: body
            });
        }
    });
    cb && cb(bodyArr);
};