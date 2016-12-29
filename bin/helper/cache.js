//cache
//If-Modified-Since/Last-Modified 字段 文件时间戳
//If-None-Match/ETag ->http1.1 散列值
//Expires 时间戳，过期时间
//Cache-Control:max-age ->http1.1
var file = require('./file');
var crypto = require("crypto");

var EXPIRES = 20 * 60 * 1000;

//设定超时时间
/**
 *
 * @param {number} expires
 */
var configExpires = function (expires) {
    if (typeof expires === 'number') {
        EXPIRES = expires;
    } else {
        throw new Error('expires must be number!!!');
    }
};

/**
 *
 * @param {string} path
 * @param {ClientRequest} req
 * @param {ServerResponse} res
 * @param {function} resolve
 * @param {function} reject
 */
var checkModified = function (path, req, res, resolve, reject) {
    file.readFileMsg(path,function (stat) {
        var lastModified = stat.mtime.toUTCString();
        if (lastModified === req.headers['if-modified-since']) {
            resolve && resolve();
        } else {
            file.readFile(path,
                function (str) {
                    //noinspection JSUnresolvedFunction
                    res.setHeader("Last-Modified", lastModified);
                    reject(str);
                }
            );
        }
    })
};

var checkETag = function (path, req, res, resolve, reject) {
    file.readFile(path,
        function (str) {
            var hash = getHash(str);
            var noneMatch = req.headers['if-none-match'];
            if (hash === noneMatch) {
                resolve && resolve()
            } else {
                //noinspection JSUnresolvedFunction
                res.setHeader("ETag", hash);
                reject && reject(str);
            }
        }
    );
};

/**
 *
 * @param {string} path
 * @param {ServerResponse} res
 * @param {function} callback
 */
var setExpires = function (path, res, callback) {
    if (!EXPIRES) throw new Error('must set expires!!!');
    file.readFile(path, function (str) {
        var expires = new Date();
        expires.setTime(expires.getTime() + EXPIRES);
        //noinspection JSUnresolvedFunction
        res.setHeader("Expires", expires.toUTCString());
        callback && callback(str);
    })
};

var setCacheControl = function (path, res, callback) {
    file.readFile(path, function (str) {
        //noinspection JSUnresolvedFunction
        res.setHeader("Cache-Control", "max-age=" + EXPIRES);
        callback && callback(str);
    })
};

function getHash (str) {
    var shaSum = crypto.createHash('sha1');
    return shaSum.update(str).digest('base64');
}

exports.configExpires = configExpires;

exports.checkModified = checkModified;
exports.checkETag = checkETag;

exports.setExpires = setExpires;
exports.setCacheControl = setCacheControl;