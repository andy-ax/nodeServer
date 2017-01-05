var querystring = require("querystring");
var xml2js = require("xml2js");
var fileMod = require("./file.js");

/**
 *
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 * @constructor
 */
var Upload = function (req, res) {
    this.req = req;
    this.res = res;
};

/**
 *
 * @param {function} cb
 */
Upload.prototype.getBody = function (cb) {
    var bufs = [];
    this.req.on('data', function (chunk) {
        bufs.push(chunk);
    }).on('end', function () {
        this.rawBody = Buffer.concat(bufs).toString();
        this.bufs = bufs;
        cb && cb();
    });
};

/**
 *
 * @param {function} cb
 */
Upload.prototype.queryString = function (cb) {
    if (this.req.headers['content-type'].indexOf('application/x-www-form-urlencoded') > -1) {
        cb && cb(querystring.parse(this.rawBody));
    }
};

/**
 *
 * @param {function} cb
 */
Upload.prototype.json = function (cb) {
    if (this.req.headers['content-type'].indexOf('application/json') > -1) {
        cb && cb(JSON.parse(this.rawBody));
    }
};

/**
 *
 * @param {function} cb
 */
Upload.prototype.xml = function (cb) {
    xml2js.parseString(this.rawBody, function (err, xml) {
        cb && cb(err, xml)
    })
};

/**
 *
 * @param {string} saveFilePath
 * @param {function} cb
 */
Upload.prototype.formData = function (saveFilePath, cb) {
    fileUploadParse(this.rawBody, Buffer.concat(this.bufs), saveFilePath, cb);
};

/**
 *
 * @param {IncomingMessage} req
 * @return {boolean}
 */
Upload.hasBody = function (req) {
    return 'transfer-encoding' in req.headers || 'content-length' in req.headers;
};

exports.Upload = Upload;

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
            fileMod.saveFile(buf, filePath + head.filename, 'utf-8', function () {
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