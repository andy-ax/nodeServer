var http = require("http");


var handle404 = require('./bin/helper/handel404').handle404;
var routeMod = require('./bin/helper/route');
var parseMod = require('./bin/helper/parse').parse;
var cookieMod = require('./bin/helper/cookie').Cookie;

//TODO 数据库 mongodb redis
//buffer stream pipe fs
//路由解析 网络映射
//浏览器缓存
//cookie session
//TODO 客户端数据上传(表单，json，xml，其他)
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
//TODO 数据收集

var process = 23000;
var onRequest = function(request, response) {
    //将解析后的路径 挂载 到 req.urlObj 上
    var urlObj = request.urlObj = parseMod(request.url);
    //路由解析
    var result = routeMod.checkPath(request, urlObj.pathname);

    if (result) {
        //cookie解析并 挂载 到 req.cookie 上
        request.cookie = cookieMod.parseCookie(request.headers.cookie);

        //执行
        var arg = [request,response].concat(result.args);
        result.action.apply(this, arg);
    } else {
        //处理404请求
        handle404(response);
    }
};
var onConnect = function () {
    console.log('connection is success!')
};

function init () {
    //listen process
    http.createServer(onRequest).listen(process, onConnect);

    //cookie & session config
    var CSConfig = require('./cookie&session_config');
    CSConfig.config();

    //cache config
    var cacheStorage = require('./cache&storage');
    cacheStorage.cacheConfig();

    //route map & follow-up actions
    var routeMap = require('./routeMap').routeMap;
    routeMap();
}

init();

//server test
var test = function () {
    var fileMod = require('./bin/helper/file');
    fileMod.readFile('./public/images/dog.png',function (file) {

    },function (err) {
        console.log(err);
    });
};
// test();