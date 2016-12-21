var querystring = require("querystring");
var url = require("url");
//url解析
/**
 *
 * @param {string} path
 * @return {{pathname: string, query: {}}}
 */
var parse = function (path) {
    var parse = {};
    var parses = url.parse(path);

    parse.pathname = parses.pathname;
    parse.query = querystring.parse(parses.query);

    test();
    return parse;
};

var test = function () {
    console.log(querystring.escape('解析'));
};

exports.parse = parse;