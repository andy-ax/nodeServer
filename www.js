var http = require("http");
var serverHelper = require("./bin/helper/server");
var url = require("express");

//TODO 缓存 数据库存储
//TODO 文件读取传输
//TODO stream buffer pipe
//TODO 路由解析 网络映射
//TODO 浏览器缓存
//TODO cookie session
//TODO 异步编程
//TODO 网络编程(tcp http udp ws)
//TODO 服务端骨架
//TODO 加密解密
//TODO 高效增删改查(算法与数组处理)
//TODO 网络安全(XSS，SQL注入)
var cache = {};
var process = 23000;
var onRequest = function(request, response) {
    if (request.url === '/') {
        serverHelper.serverStatic(response, cache, './public/index.html');
    } else {
        
    }
};
var onConnect = function () {
    console.log('connection is success!')
};
http.createServer(onRequest).listen(process, onConnect);