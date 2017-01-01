var routeMod = require('./bin/helper/route');
var fileMod = require('./bin/helper/file');
var cacheMod = require('./bin/helper/cache');
var handle404 = require('./bin/helper/handel404').handle404;
var cookieMod = require('./bin/helper/cookie').Cookie;
var init = function () {
    //路由映射 增加post 删除delete 修改put 查询get
    addRouteReg();

    getRoute();
    postRoute();
    deleteRoute();
    putRoute();
};

var addRouteReg = function () {
    //添加路由映射正则
    routeMod.addRule(':username',/:username/g,'([0-9a-zA-Z_]+)');
    routeMod.addRule(':room',/:room/g,'room(\\\d+)');
    routeMod.addRule(':css',/:css/g,'([0-9a-zA-Z_]+\\\.css)');
    routeMod.addRule(':js',/:js/g,'([0-9a-zA-Z_]+\\\.js)');
    routeMod.addRule(':img',/:img/g,'([0-9a-zA-Z_]+\\\.(?:png|jpg))');
    routeMod.addRule(':font',/:font/g,'([0-9a-zA-Z_]+\\\.(?:eot|svg|ttf|woff))');
};

var getRoute = function () {
    routeMod.get('/', function (req, res) {
        var cookie = new cookieMod(req, res);
        cookie.checkAllCookie();
        fileMod.readFile('./public/index.html', function (file) {
            cookie.setCookie();
            res.writeHeader(200, 'OK');
            res.end(file);
        },function (err) {
            if (err.code === 'ENOENT') {
                handle404(res);
            }
        })
    });
    routeMod.get('/img/:img', function (req, res, img) {
        cacheMod.checkModified('./public/images/' + img, req, res, function () {
            res.writeHeader(304, 'Not Modified');
            res.end();
        }, function (file) {
            res.writeHeader(200, 'OK');
            res.end(file);
        }, function (err) {
            if (err.code === 'ENOENT') {
                handle404(res);
            }
        })
    });
    routeMod.get('/css/:css', function (req, res, css) {
        fileMod.readFile('./public/stylesheets/' + css,function (file) {
            //noinspection JSUnresolvedFunction
            res.setHeader('content-type', 'text/css');
            res.writeHeader(200, 'OK');
            res.end(file);
        },function (err) {
            if (err.code === 'ENOENT') {
                handle404(res);
            }
        });
    });
    routeMod.get('/js/:js', function (req, res, js) {
        fileMod.readFile('./public/javascript/' + js, function (file) {
            res.writeHeader(200, 'OK');
            res.end(file);
        },function (err) {
            if (err.code === 'ENOENT') {
                handle404(res);
            }
        });
    });
    routeMod.get('/css/font/:font', function (req, res, font) {
        cacheMod.checkModified('./public/font/' + font, req, res, function () {
            res.writeHeader(304, 'Not Modified');
            res.end();
        }, function (file) {
            //noinspection JSUnresolvedFunction
            res.setHeader('content-type', 'text/html');
            res.writeHeader(200, 'OK');
            res.end(file);
        }, function (err) {
            if (err.code === 'ENOENT') {
                handle404(res);
            }
        })
    });
    routeMod.get('login/:username', function (req, res, name) {

    });
    // routeMod.get('/user/:username', function (req, res, name) {
    //
    // });
    // routeMod.get('/hall/:room', function (req, res, room) {
    //
    // });
};

var postRoute = function () {
    routeMod.post('login/:username', function (req, res, name) {

    });
    // routeMod.post('/user/:username', function (req, res, name) {
    //
    // });
};

var deleteRoute = function () {
    // routeMod.delete('/user/:username', function (req, res, name) {
    //
    // });
    // routeMod.delete('/hall/:room', function (req, res, room) {
    //
    // });
};

var putRoute = function () {

};

exports.routeMap = init;