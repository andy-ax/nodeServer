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
            req.bufs = bufs;
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
        fileUploadParse(req.rawBody, Buffer.concat(req.bufs), './test/dataUpload/file/', function () {

        })
    }
}

var hasBody = function(req) {
    return 'transfer-encoding' in req.headers || 'content-length' in req.headers;
};

var fileUploadParse = function (utf8str, buffer, filePath, cb) {

    //获取模块分割字符串
    var expModule = /^([^\r\n]+)\r\n/;
    var header = expModule.exec(utf8str);

    //分割模块
    var sp = '\r\n' + header[1] + '--';
    if (utf8str.indexOf(sp) > -1) {
        utf8str = utf8str.replace(sp, '');//去除尾部
        buffer = buffer.slice(0,buffer.length - (new Buffer(sp)).length);
    }
    var strArr = utf8str.split(header[0]);//分割数组
    var bufIndexs = getArrSame(buffer,new Buffer(header[0]));
    bufIndexs.push([buffer.length - 1]);
    strArr.shift();//去除头部

    var bodyArr = [];

    new syncEach(strArr, function (str, i) {
        var self = this;

        //分割头与体
        var arr = /^([\w\W]+?)\r\n\r\n([\w\W]+)$/.exec(str);
        var head = arr[1];
        var body = arr[2];
        var headLen = head.length;

        body.length -= 2;

        //file判断
        var file;
        if (head.indexOf('Content-Type') > -1) {
            file = true;
        }

        //头部转化为obj
        head = head.replace(/Content-Type: ([^\r\n]+)($|\r\n)/,'')
            .replace(/\r\n/g, '')
            .replace(/\s+/g, '')
            .replace('Content-Disposition:form-data;', '')
            .replace(/"/g,'');
        head = querystring.parse(head, ';', '=');

        //file处理
        if (file) {
            var buf = buffer.slice(bufIndexs[i][1] + headLen + 4,bufIndexs[i+1][0] - 2);
            fileMod.saveFile(buf, filePath + head.filename, 'utf-8',function () {
                bodyArr.push({
                    head: head,
                    body: filePath + head.filename
                });
                self.next();
            });
        } else {
            bodyArr.push({
                head: head,
                body: body
            });
            this.next();
        }
    });
    cb && cb(bodyArr);
};

var bufIndex = function (buf, indexBuf) {
    var newBuf = new Buffer(buf.length);
    buf.copy(newBuf,0,0,buf.length);
    return dels(buf,indexBuf,[]);
};

function getArrSame (arr1, arr2) {
    var arrIndex = [];
    var arr2Len = arr2.length;
    for (var i = 0,len = arr1.length - arr2Len; i < len;) {
        if (isSame(arr1.slice(i,i+arr2Len), arr2)) {
            arrIndex.push([i,i+arr2Len]);
            i += arr2Len;
        } else {
            i++;
        }
    }
    return arrIndex;
}

function isSame (arr1,arr2){
    if (arr1.length !== arr2.length) return false;
    for(var i = 0,len = arr1.length; i < len; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }
    return true;
}

function dels (buf, del, arr) {
    var index = buf.indexOf(del);
    if (index > -1) {
        arr.push([index,index + del.length]);
        return dels(buf,del,arr);
    } else {
        return arr;
    }
}

var concatBufArrayToBuf = function (bufArr, start, len) {
    var i = 0,
        j = 0,
        s = 0,
        e = 0,
        end = start + len - 1,
        newBufArr = [],
        buf0I = 0,
        buf1I = 0;

    bufArr.some(function (buf, index) {
        e = s + buf.length - 1;
        if (start <= e) {
            if (end > e) {

            } else {
                newBufArr.push(buf.slice());
            }
        }
    });
};

var syncEach = function(array, func){
    this.array = array;
    this.func = func;
    this.i = 0;
    this.func(this.array[0], 0);
};

syncEach.prototype.next = function (){
    this.i++;
    if (this.i < this.array.length) {
        this.func(this.array[this.i], this.i, this.array);
    }
};