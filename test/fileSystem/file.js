//stream,pipe,buffer,fs
//fs -> 文件的读取写入传输
//stream -> 以流的方式读取写入文件 (fs会一次性读取写入，当文件较大时会出问题)
//          因为缓冲空间有限，所以读取速度和写入速度可能会有偏差
//pipe -> 从可读流中拉取数据写入到目标可写流中 (简化了stream的写入)

//demo
var fs = require("fs");
var out = require("readline");//标准输入输出

var sourcePath = '../../public/images/v2-e8255eac37485f3354cef0a0c5d72b68_b.jpg';
var writePath = '../../public/images/writestream.jpg';

var init1 = function () {
    //stream
    var readStream = fs.createReadStream(sourcePath);
    var writeStream = fs.createWriteStream(writePath);

    readStream.on('data', function(chunk) { // 当有数据流出时，写入数据
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
    fs.createReadStream(sourcePath).pipe(fs.createWriteStream(writePath));
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

