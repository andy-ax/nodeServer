var queryString = require('querystring');

var option;
//cookie配置
var cookies = {};

//cookie实例
//所有要处理的数据都会挂载在Cookie实例上
/**
 *
 * @param {Object} req
 * @param {Object} res
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

/**
 * 检查设定的cookie是否存在
 * @param {string} key
 * @param {function} success
 * @param {function} [fail]
 */
Cookie.prototype.checkCookie = function (key, success, fail) {
    if (this.req.cookie[key] !== undefined) {
        success && success(this);
    } else {
        fail && fail(this)
    }
};

/**
 * 检查全部 cookie
 */
Cookie.prototype.checkAllCookie = function () {
    var success,fail;
    for (var i in cookies) {
        success = cookies[i].success;
        fail = cookies[i].fail;
        this.checkCookie(i,success,fail);
    }
};

//cookie 辅助函数

/**
 * option设置
 * @param {object} opt
 */
Cookie.setOption = function (opt) {
    option = opt;
};

/**
 * 存储已配置的cookie
 * @param {string} key
 * @param {function} success
 * @param {function} fail
 */
Cookie.cookieConfig = function (key, success, fail) {
    cookies[key] = {
        success,
        fail
    };
};

/**
 * 将cookie切成对象
 * @param {string} cookie
 * @return {object}
 */
Cookie.parseCookie = function (cookie) {
    return queryString.parse(cookie, ';', '=');
};

/**
 * 创建cookie
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