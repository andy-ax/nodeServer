var http = require("http");


var handle404 = require('./bin/helper/handel404').handle404;
var routeMod = require('./bin/helper/route');
var parseMod = require('./bin/helper/parse').parse;
var cookieMod = require('./bin/helper/cookie');
var sessionMod = require('./bin/helper/session');
var fileMod = require('./bin/helper/file');
var cacheMod = require('./bin/helper/cache');

//TODO 数据库 mongodb redis
//buffer stream pipe fs
//路由解析 网络映射
//浏览器缓存
//cookie session
//TODO 异步编程 异步控制
//TODO 网络编程(tcp http udp ws)
//TODO 多进程child_process cluster
//TODO 服务端骨架 express
//TODO 加密解密 crypto
//TODO 高效增删改查(算法与数组处理)
//TODO 网络安全(XSS，SQL注入)
//TODO 网络爬虫
//TODO jade模版 模版引擎
//TODO 错误处理与调试 domain 格式化输出 writeLine

var cache = {};
var process = 23000;
var onRequest = function(request, response) {
    if (request.url === '/') {

    } else {
        //路径解析
        var urlObj = parseMod(request.url);
        //路由映射
        var result = routeMod.pathSet(request, urlObj.pathname);
        var cookies = cookieMod.parseCookie(request.headers.cookie);
        if (result) {
            result.action.apply(this, result.args);
        } else {
            //处理404请求
            handle404(response);
        }
    }
};
var onConnect = function () {
    console.log('connection is success!')
};

function init () {
    //监听端口
    http.createServer(onRequest).listen(process, onConnect);
    //路由映射
    routeMod.get('/user/:username', function (req, res, name) {

    });
    routeMod.delete('/user/:username', function (req, res, name) {

    });
    routeMod.post('/user/:username', function (req, res, name) {

    });
    routeMod.get('/hall/:room', function (req, res, name) {

    });
    routeMod.delete('/hall/:room', function (req, res, name) {

    });

    //cookie配置
    cookieMod.setOption({
        maxAge: 60 * 60 * 24 * 30,
        domain: '127.0.0.1',
        path: '/',
        httpOnly: true
    });
    //session cache 超时设置
    sessionMod.configExpires(20 * 60 * 1000);
    cacheMod.configExpires(10 * 365 * 24 * 60 * 60 * 1000);

}

init();