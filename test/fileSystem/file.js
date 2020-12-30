//stream,pipe,buffer,fs
//fs -> 文件的读取写入传输
//stream -> 以流的方式读取写入文件 (fs会一次性读取写入，当文件较大时会出问题)
//          因为缓冲空间有限，所以读取速度和写入速度可能会有偏差
//pipe -> 从可读流中拉取数据写入到目标可写流中 (简化了stream的写入)

//demo
var fs = require("fs");
var out = require("readline");//标准输入输出

var sourcePath = './public/images/v2-e8255eac37485f3354cef0a0c5d72b68_b.jpg';
var writePath = './public/images/writestream.jpg';

var init1 = function () {
    //stream
    var readStream = fs.createReadStream(sourcePath);
    var writeStream = fs.createWriteStream(writePath);

    readStream.on('data', function(chunk) { // 当有数据流出时，写入数据 每68kb触发一次
        console.log(chunk);
        if (writeStream.write(chunk) === false) { // 如果没有写完，暂停读取流
            readStream.pause();
        }
    });

    writeStream.on('drain', function() { // 写完后，继续读取
        readStream.resume();
    });

    readStream.on('end', function() { // 当没有数据时，关闭数据流
        writeStream.end();
    });

    //pipe自动调用了data,end等事件
    // fs.createReadStream(sourcePath).pipe(fs.createWriteStream(writePath));
};
var init2 = function () {
    var readStream = fs.createReadStream('/Users/andy/Downloads/dmg&zip/PhpStorm-2016.3.dmg');
    var writeStream = fs.createWriteStream('../../public/images/phpStorm.dmg');

    //stat 获取文件信息 fs.stat(path, [callback(err, stats)])
    var fileMsg = fs.statSync(sourcePath);

    var totalSize = fileMsg.size;
    var passedLength = 0;
    var lastSize = 0;
    var startTime = Date.now();

    readStream
        .on('data', function (chunk) {
            passedLength += chunk.length;

            if (writeStream.write(chunk) === false) {
                readStream.pause();
            }
        })
        .on('end', function () {
            writeStream.end();
        });

    writeStream.on('drain', function () {
        readStream.resume();
    });

    setTimeout(function () {
        var percent = Math.ceil((passedLength / totalSize) * 100);
        var size = Math.ceil(passedLength / 1000000);
        var diff = size - lastSize;
        lastSize = size;
        out.clearLine();
        out.cursorTo(0);
        out.write('已完成' + size + 'MB,' + percent + '%, 速度: ' + diff * 2 + 'MB/s');
        if (passedLength < totalSize) {
            setTimeout(arguments.callee, 500);
        } else {
            var endTime = Date.now();
            console.log('共用时: ' + (endTime - startTime) / 1000 + '秒');
        }
    },500);
};

var init3 = function () {
    var readFileMsg = function (filePath, resolve, reject) {
        fs.stat(filePath, function (err, stat) {
            if (err) {
                if (reject) {
                    reject(err);
                } else {
                    throw new Error('file load failed!!!');
                }
            } else {
                resolve && resolve(stat);
            }
        })
    };

    var path = '/Users/andy/WebstormProjects/nodeServer/public/text/saveDoc.txt';
    // readFileMsg(path, function (msg) {
    //     var wS = fs.createWriteStream(path,{flags: 'w',
    //         defaultEncoding: 'utf8',
    //         fd: null,
    //         autoClose: true,
    //         start:0
    //     });
    //     var str = '第3次写入 ';
    //     var buf = new Buffer(str, 'utf-8');
    //     wS.write(buf, 'UTF-8', function () {
    //         console.log('end');
    //         wS.end();
    //     }, false);
    //     wS.on('finish', function () {
    //         console.log('finish');
    //     });
    //     wS.on('error', function (err) {
    //         console.log(err.stack);
    //     })
    // });

    function addToFile(path, config, resolve, reject) {
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
                fileText = insertBuffer(
                    addAllBuffer(buffers),
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
    }
    function insertBuffer(buf0, buf1, start) {
        var len = buf0.length;
        var allBuf = new Buffer(len + buf1.length);
        buf0.copy(allBuf,0,0,start);//copy(粘贴目标Buffer,从粘贴目标Buffer的第n位开始,从复制目标的第n位开始,到复制目标的第n位结束)复制字符 n从0开始索引
        buf1.copy(allBuf,start,0);
        buf0.copy(allBuf,start+buf1.length,start);
        return allBuf;
    }
    function addAllBuffer(bufArr) {
        var len = 0;
        var copyLen = [];
        bufArr.forEach(function (buf) {
            copyLen.push(len);
            len += buf.length;
        });
        var allBuf = new Buffer(len);
        bufArr.forEach(function (buf,i) {
            buf.copy(allBuf,copyLen[i],0);
        });
        return allBuf;
    }
    addToFile(path, {text:' andy ',start:3},function () {
        fs.unlink(path);
    });
};

var readStream = function () {
    var sourcePath = './test/fileSystem/text.txt';
    var read = fs.createReadStream(sourcePath);
    read.setEncoding('UTF8');
    let data = '';
    read.on('data',chunk=>{
        data+=chunk;
    });
    read.on('end',()=>{
        console.log(data);
    })
};
var writeStream = function () {
    const text = '你好~';
    const path = './test/fileSystem/write.txt';
    var write = fs.createWriteStream(path);
    write.write(text);
};
writeStream();