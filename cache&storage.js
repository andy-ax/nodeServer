var cacheMod = require("./bin/helper/cache.js");
var mongo = require("./bin/helper/mongodb");

mongo.setUrl('localhost');
var Users = mongo.createMongoModel({
    name: String,
    password: String,
    user_id: String
},'users');

var init = function () {
    //cache 超时设置
    cacheMod.configExpires(10 * 365 * 24 * 60 * 60 * 1000);
};

exports.cacheConfig = init;
exports.Users = Users;