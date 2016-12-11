var http = require("http");
var serverHelper = require("./bin/helper/server");

//TODO 缓存 数据库存储
//TODO 文件读取传输
//TODO stream buffer pipe
//TODO 路由解析 网络映射
//TODO 浏览器缓存
//TODO cookie session
//TODO 异步编程
//TODO 网络编程(tcp http udp ws)
//TODO 服务端骨架
var cache = {};
var process = 23000;
var onRequest = function(request, response) {
    // var filePath =  './public' + (request.url === '/' ? '/index.html' : request.url);
    // serverHelper.serverStatic(response, cache, filePath);
    if (request.url === '/') {
        serverHelper.serverStatic(response, cache, './public/index.html');
    } else if (request.url === '/getdata') {
        response.writeHead(200,{
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive"
        });
    }
    response.on('finish',function (data) {

    });
};
var onConnect = function () {
    console.log('connection is success!')
};
http.createServer(onRequest).listen(process, onConnect);