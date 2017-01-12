var mongoose = require('mongoose');
var dbURL = '';

/**
 *
 * @param {object} schema
 * @param {string} name
 * @return {*|Aggregate|Model}
 */
var createMongoModel = function (schema,name) {
    if (!dbURL) throw new Error('db url is not config');
    return mongoose.model(name,(new mongoose.Schema(schema)));
};

/**
 *
 * @param {string|{username:string,password:string,hostname:string,port:number}} config
 */
var setUrl = function (config) {
    if (config === 'localhost') {
        dbURL = 'mongodb://localhost/database';
    } else {
        dbURL = 'mongodb://' + config.username + ':' + config.password + '@' + config.hostname + ':' + config.port + '/database'
    }
    mongoose.connect(dbURL);
};

exports.createMongoModel = createMongoModel;
exports.setUrl = setUrl;