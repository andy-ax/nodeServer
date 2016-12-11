var ws = require("nodejs-websocket");

var server = ws.createServer(function (conn,p) {
    if (conn.url === '/') {
        debugger
    } else {
        conn.on('text', function (string) {
            console.log('收到的信息为：' + string);
            conn.sendText(string);
        });
        conn.on('close',function (code, reason) {
            console.log('关闭连接，code:' + code + ',reason:' + reason);
        });
        conn.on('error',function (code, reason) {
            console.log('异常关闭，code:' + code + ',reason:' + reason);
        });
        console.log('已连接');
    }
});
server.listen(32002);