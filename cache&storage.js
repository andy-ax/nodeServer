var cacheMod = require("./bin/helper/cache.js");
var cache = {};

var init = function () {
    //cache 超时设置
    cacheMod.configExpires(10 * 365 * 24 * 60 * 60 * 1000);
};

exports.cacheConfig = init;
exports.cache = cache;