var querystring = require('querystring');

var option;
//这里先用缓存存储，后面学到数据库和filesystem再改变
var cookies = {};

//option设置 cookie 获取 检验 存储 发送
var setOption = function (opt) {
    option = opt;
};

var parseCookie = function (cookie) {
    return querystring.parse(cookie, ';', '=');
};

var checkCookie = function (key, value, match, noMatch, noExist) {
    var result = getCookie(key, value);

    if (result === value) {
        match();
    } else if (result !== value && result !== false) {
        noMatch();
    } else {
        noExist();
    }

};

var cookieStorage = function (key, value) {
    cookies[key] = value;
};

var buildCookie = function (name, val, opt) {
    var pairs = [name + '=' + querystring.escape(val)];
    opt = opt || option;
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

/**
 *
 * @param key
 * @param value
 * @return {boolean}
 */
function getCookie (key, value) {
    return cookies[key] ? value : false;
}

exports.setOption = setOption;
exports.parseCookie = parseCookie;
exports.checkCookie = checkCookie;
exports.cookieStorage = cookieStorage;
exports.buildCookie = buildCookie;