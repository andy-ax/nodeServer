var http = require("http");
var serverHelper = require("./bin/helper/server");

var cache = {};
var server = http.createServer(function (request, response) {
    var filePath =  './public' + (request.url === '/' ? '/index.html' : request.url);
    serverHelper.serverStatic(response, cache, filePath);
});
server.listen(23000, function () {

});