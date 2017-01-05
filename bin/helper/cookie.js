var queryString = require('querystring');

var option;
//cookie配置
var cookies = {};

//cookie实例
//所有要处理的数据都会挂载在Cookie实例上
/**
 *
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 * @constructor
 */
var Cookie = function (req, res) {
    this.req = req;
    this.res = res;
    this.cookie = [];
};

//设置cookie头
Cookie.prototype.setCookie = function () {
    if (this.cookie.length === 1) {
        this.res.setHeader('Set-Cookie',this.cookie[0]);
    } else {
        this.res.setHeader('Set-Cookie',this.cookie);
    }
};

//检查cookie
/**
 *
 * @param {string} key
 * @param {function} resolve
 * @param {function} reject
 */
Cookie.prototype.checkCookie = function (key, resolve, reject) {
    var result = !!this.req.cookie[key];

    if (result) {
        resolve && resolve(this);
    } else {
        reject && reject(this)
    }
};

//检查全部 cookie
Cookie.prototype.checkAllCookie = function () {
    var resolve,reject;
    for (var i in cookies) {
        resolve = cookies[i].resolve;
        reject = cookies[i].reject;
        this.checkCookie(i,resolve,reject);
    }
};

//cookie 辅助函数

//option设置
/**
 *
 * @param {object} opt
 */
Cookie.setOption = function (opt) {
    option = opt;
};

//存储已配置的cookie
/**
 *
 * @param {string} key
 * @param {function} resolve
 * @param {function} reject
 */
Cookie.cookieConfig = function (key, resolve, reject) {
    cookies[key] = {
        resolve: resolve,
        reject: reject
    };
};

//将cookie切成对象
/**
 *
 * @param {string} cookie
 * @return {object}
 */
Cookie.parseCookie = function (cookie) {
    return queryString.parse(cookie, ';', '=');
};

//创建cookie
/**
 *
 * @param {string} name
 * @param  val
 * @param {object} [opt]
 * @return {string}
 */
Cookie.buildCookie = function (name, val, opt) {
    var pairs = [name + '=' + queryString.escape(val)];
    opt ? extend(option, opt) : opt = option;
    try {
        if (opt.maxAge) pairs.push('Max-Age=' + opt.maxAge);
        if (opt.domain) pairs.push('Domain=' + opt.domain);
        if (opt.path) pairs.push('Path=' + opt.path);
        if (opt.expires) pairs.push('Expires=' + opt.expires.toUTCString());
        if (opt.httpOnly) pairs.push('HttpOnly');
        if (opt.secure) pairs.push('Secure');
        return pairs.join('; ');
    } catch (e) {
        throw new Error('must set option!!!');
    }
};

//模块内部使用函数
function getCookie (key) {
    return !!cookies[key];
}
function extend (source, destination) {
    destination = arguments[1];
    for (var property in source) {
        if (!destination[property]) destination[property] = source[property];
    }
    return destination;
}

exports.Cookie = Cookie;