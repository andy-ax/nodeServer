var fs = require('fs');
var buffer = require("./buffer.js");
var FileError = require("./error.js").FileError;

//TODO 读取文件 读取文件信息 复制文件 写入文件

/**
 *
 * @param {string} filePath
 * @return void
 */
var readFileStream = function (filePath) {
    return new Promise((res, rej)=>{
        let readStream = fs.createReadStream(filePath);
        let data = '';
        readStream
            .on('data', chunk=>{
                data+=chunk;
            })
            .on('end', function () {
                res && res();
            })
            .on('error', function (err) {
                rej && rej(err);
            });
    });
};

/**
 * 读取文件
 * @param {string} filePath
 * @param {function} success
 * @param {function} [fail]
 */
var readFile = function (filePath, success, fail) {
    var path = filePath;
    fs.readFile(filePath,function (err, file) {
        if (err) {
            if (fail) {
                fail(err);
            } else {
                console.log(path);
                throw new FileError('file load failed!!!');
            }
        } else {
            success && success(file);
        }
    });
};

/**
 *
 * @param {string} filePath
 * @param {function} resolve
 * @param {function} [reject]
 */
var readFileMsg = function (filePath, resolve ,reject) {
    fs.stat(filePath, function (err, stat) {
        if (err) {
            if (reject) {
                reject(err);
            } else {
                throw new FileError('file load failed!!!');
            }
        } else {
            resolve && resolve(stat);
        }
    })
};

var saveFile = function (file, path, encode, resolve, reject) {
    encode = encode || 'utf-8';

    var wS = fs.createWriteStream(path);
    wS.write(file, encode, function () {
        wS.end();
    });
    wS.on('finish', function () {
        resolve && resolve();
    });
    wS.on('error', function (err) {
        reject && reject(err);
    })
};

/**
 *
 * @param {string} readPath
 * @param {string} writePath
 * @param {function} [resolve]
 * @param {function} [reject]
 * @return void
 */
var copyFile = function (readPath, writePath, resolve, reject) {
    fs.createReadStream(readPath)
        .on('end', function () {
            resolve && resolve();
        })
        .on('error', function (err) {
            reject && reject(err);
        })
        .pipe(fs.createWriteStream(writePath));
};

/**
 *
 * @param {string} path
 * @param {object} config
 * @param {function} [resolve]
 * @param {function} [reject]
 */
var addToFile = function (path, config, resolve, reject) {
    if (!config.text) throw new Error('no text write!!!');

    var fileText;
    var buffers = [];
    var encode = config.encode || 'utf-8';

    fs.createReadStream(path)
        .on('data', function (buf) {
            buffers.push(buf);
        })
        .on('end', function () {
            var fileBuf = new Buffer(config.text);
            fileText = buffer.insertBuffer(
                buffer.array2Buffer(buffers),
                fileBuf,
                config.start || 0
            );
            var wS = fs.createWriteStream(path);
            wS.write(fileText, encode, function () {
                wS.end();
            });
            wS.on('finish', function () {
                resolve && resolve();
            });
            wS.on('error', function (err) {
                reject && reject(err);
            })
        })
};

exports.readFile= readFile;
exports.readFileMsg = readFileMsg;
exports.saveFile = saveFile;
exports.copyFile = copyFile;
exports.addToFile = addToFile;