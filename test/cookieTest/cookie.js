var http = require("http");
var fs = require("fs");
var parseMod = require('../../bin/helper/parse').parse;

var onRequest = function(req, res) {
    var cookie = parseCookie(req.headers.cookie);
    if (!cookie.isVisit3) {
        res.setHeader('Set-Cookie', serialize('isVisit3', '1', {
            maxAge: 60 * 60 * 24 * 30,//cookie保存时长
            domain: 'localhost',
            path: '/',//路径，子路径都可以得到该cookie
            httpOnly: true//只在http下保存cookie
        }));
        res.writeHead(200);
    } else {
        res.writeHeader(200);
    }
    fs.readFile('./test/cookieTest/index.html',function (file) {
        res.end(file);
    })
};
var onConnect = function () {
    console.log('connection is success!')
};

http.createServer(onRequest).listen(23002, onConnect);

var parseCookie = function (cookie) {
    var cookies = {};
    if (!cookie) {
        return cookies;
    }
    var list = cookie.split(';');
    for (var i = 0; i < list.length; i++) {
        var pair = list[i].split('=');
        cookies[pair[0].trim()] = pair[1];
    }
    return cookies;
};

var serialize = function (name, val, opt) {
    var pairs = [name + '=' + val];
    opt = opt || {};

    if (opt.maxAge) pairs.push('Max-Age=' + opt.maxAge);
    if (opt.domain) pairs.push('Domain=' + opt.domain);
    if (opt.path) pairs.push('Path=' + opt.path);
    if (opt.expires) pairs.push('Expires=' + opt.expires.toUTCString());
    if (opt.httpOnly) pairs.push('HttpOnly');
    if (opt.secure) pairs.push('Secure');
    return pairs.join('; ');
};