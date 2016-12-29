//向一个buf中的指定位置插入buf
var insertBuffer = function (buf0, buf1, start) {
    var len = buf0.length;
    var allBuf = new Buffer(len + buf1.length);
    buf0.copy(allBuf,0,0,start);//copy(粘贴目标Buffer,从粘贴目标Buffer的第n位开始,从复制目标的第n位开始,到复制目标的第n位结束)复制字符 n从0开始索引
    buf1.copy(allBuf,start,0);
    buf0.copy(allBuf,start+buf1.length,start);
    return allBuf;
};
//buf数组转buf
var array2Buffer = function (bufArr) {
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
};

exports.insertBuffer = insertBuffer;
exports.array2Buffer = array2Buffer;