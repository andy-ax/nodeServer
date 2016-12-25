var http = require("http");
var serverHelper = require("./bin/helper/server");
var handle404 = require('./bin/helper/handel404').handle404;
var route = require('./bin/helper/route');
var parse = require('./bin/helper/parse').parse;
var cookie = require('./bin/helper/cookie');

//TODO 缓存 数据库存储
//TODO buffer stream pipe fs
//路由解析 网络映射
//TODO 浏览器缓存
//cookie session
//TODO 异步编程
//TODO 网络编程(tcp http udp ws)
//TODO 服务端骨架
//TODO 加密解密
//TODO 高效增删改查(算法与数组处理)
//TODO 网络安全(XSS，SQL注入)
//TODO 网络爬虫
//TODO jade模版 模版引擎

var cache = {};
var process = 23000;
var onRequest = function(request, response) {
    if (request.url === '/') {
        serverHelper.serverStatic(response, cache, './public/index.html');
    } else {
        //路径解析
        var urlObj = parse(request.url);
        //路由映射
        var result = route.pathSet(request, urlObj.pathname);
        var cookies = cookie.parseCookie(request.headers.cookie);
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
    http.createServer(onRequest).listen(process, onConnect);
    route.use('/user/:username', 'get', function (req, res, name) {
        //在这里处理请求的响应

        debugger
    });
    cookie.setOption({
        maxAge: 60 * 60 * 24 * 30,
        domain: '127.0.0.1',
        path: '/',
        httpOnly: true
    });
}

init();