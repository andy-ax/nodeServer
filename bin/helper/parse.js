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

    return parse;
};

exports.parse = parse;