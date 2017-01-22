var cacheMod = require("./bin/helper/cache.js");
var mongo = require("./bin/helper/mongodb");

mongo.setUrl('localhost');

try {
    var Users = mongo.createMongoModel({
        name: String,
        password: String,
        u_info: {
            name: String,
            avatar: String,
            friend: Array,
        }
    },'users');

    Users._initMod = function (name, password) {
        return new InitMod(name, password);
    };

    function InitMod(name, password) {
        this.name = name;
        this.password = password;
        this.u_info = {
            name: name,
            avatar: './img/default.jpg',
            friend: [],
        }
    }

    var init = function () {
        //cache 超时设置
        cacheMod.configExpires(10 * 365 * 24 * 60 * 60 * 1000);
    };

    exports.cacheConfig = init;
    exports.Users = Users;

} catch (e) {
    console.log(e);
}
