var routeMod = require('./bin/helper/route');
var fileMod = require('./bin/helper/file');
var cacheMod = require('./bin/helper/cache');
var sessionMod = require('./bin/helper/session.js');
var SyncList = require('./bin/helper/syncList.js').SyncList;
var Upload = require('./bin/helper/upload.js').Upload;
var handle404 = require('./bin/helper/handel404').handle404;
var cookieMod = require('./bin/helper/cookie').Cookie;
var Users = require('./cache&storage').Users;

var init = function () {
    //路由映射 增加post 删除delete 修改put 查询get
    addRouteReg();

    getRoute();
    // postRoute();
    // deleteRoute();
    // putRoute();
};

//TODO 修改加空格的地方 代码优化 session转数据库存储 mongoose报错

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
    //加载主页
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
    //读取图片
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
    //读取css
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
    //读取js
    routeMod.get('/js/:js', function (req, res, js) {
        fileMod.readFile('./public/javascripts/' + js, function (file) {
            res.writeHeader(200, 'OK');
            res.end(file);
        },function (err) {
            if (err.code === 'ENOENT') {
                handle404(res);
            }
        });
    });
    //读取font文件
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
    //查询session
    routeMod.get('/session', function (req, res) {
        //查询cookie -> 查询session -> 校验user
        var cookie = new cookieMod(req, res);
        cookie.checkCookie('s_id', function () {
            //存在s_id
            sessionMod.checkSession(req.cookie['s_id'], function (session) {
                //校验session与user的映射
                Users.find({name: session.user}).exec(function (err, datas) {
                    if (!err && datas.length === 1) {
                        if (datas[0].name === session.user) {
                           //更新cookie
                            cookie.cookie.push(cookieMod.buildCookie(
                                's_id',
                                session.s_id,
                                {
                                    maxAge:session.cookie.expire
                                }
                            ));
                            cookie.setCookie();

                            res.setHeader('content-type', 'application/json');
                            res.writeHeader(200, 'OK');
                            //返回u_info json
                            let u_info = datas[0].u_info;
                            res.end(JSON.stringify(u_info));
                            return;
                        }
                    }
                    handle404(res);
                })
            },function () {
               //s_id 过期或不正确 -> 404
                handle404(res);
            });
        }, function () {
            //不存在s_id -> 404
            handle404(res);
        })
    });
    //登录 -> queryString -> 新增session -> 关联user
    routeMod.get('/login', function (req, res) {
        var syncList = new SyncList();
        var upload = new Upload(req,res);
        var cookie = new cookieMod(req,res);

        //检查内容
        syncList
            //校验查询字符串
            .push(function () {
                var query = req.urlObj.query;
                if (query.name && query.password) {
                    syncList.next();
                } else {
                    console.error('参数不足');
                    handle404(res,'无效的用户名或密码');
                }
            })
            //数据库校验
            .push(function () {
                var query = req.urlObj.query;
                Users.find({name: query.name}).exec(function (err, datas) {
                    try {
                        if (!err) {
                            if (datas.length === 1 && datas[0].password === query.password) {
                                req.u_info = datas[0].u_info;
                            }
                            syncList.next();
                            return;
                        }
                        console.log(err);
                    } catch (e) {
                        console.log(e);
                    }
                });
            })
            .push(function () {
                var query = req.urlObj.query;
                if (req.u_info) {
                    //新增session
                    var sessions = sessionMod.generateSession(query.name);
                    //推入cookie
                    cookie.cookie.push(cookieMod.buildCookie(
                        's_id',
                        sessions.s_id,
                        {
                            maxAge:sessions.cookie.expire
                        }
                    ));
                    cookie.setCookie();
                }
                res.setHeader('content-type', 'application/json');
                res.writeHeader(200, 'OK');
                //返回u_info json
                var info = JSON.stringify(req.u_info ? {info:'登录成功',u_info:req.u_info} : {info:'用户名或密码错误'});
                res.end(info);
            })
            .start();
    });
    // routeMod.get('/user/:username', function (req, res, name) {
    //
    // });
    // routeMod.get('/hall/:room', function (req, res, room) {
    //
    // });
};

var postRoute = function () {
    //注册 -> 校验 -> 存入 -> session设置
    routeMod.post('/login', function (req, res) {
        var syncList = new SyncList();
        var upload = new Upload(req,res);
        var cookie = new cookieMod(req,res);
        
        syncList
            .push(upload.getBody, upload, function () {
                syncList.next();
            })
            .push(upload.queryString, upload, function (qs) {

                if(checkPassword(qs.password)) {
                    req.qs = qs;
                    syncList.next();
                } else {
                    failed();
                }
            })
            .push(function () {
                var qs = req.qs;
                Users.find({name:qs.name}).exec(function (err, datas) {
                    if (err) {
                        console.error('数据库读取失败,错误原因：' + err)
                    } else if (datas.length === 0) {
                        syncList.next();
                    } else {
                        failed('用户名已存在，请登录');
                    }
                });
            })
            .push(function () {
                req.initMod = Users._initMod(req.qs.name,req.qs.password);
                syncList.next();
            })
            .push(function () {
                Users.create(req.initMod, function (err) {
                    if (!err) {
                        //新增session
                        var session = sessionMod.generateSession(req.qs.name);
                        //推入cookie
                        cookie.cookie.push(cookieMod.buildCookie(
                            's_id',
                            session.s_id,
                            {
                                maxAge:session.cookie.expire
                            }
                        ));
                        cookie.setCookie();

                        success(req.initMod.u_info);
                        return;
                    }
                    console.log(err);
                })
            })
            .start();
        
        function failed(msg) {
            res.setHeader('content-type', 'application/json');
            res.writeHeader(200, 'OK');
            //返回u_info json
            var info = JSON.stringify({info:'用户名或密码不符合规范'||msg});
            res.end(info);
        }
        function success(u_info) {
            res.setHeader('content-type', 'application/json');
            res.writeHeader(200, 'OK');
            //返回u_info json
            var info = JSON.stringify({info:'注册成功',u_info: u_info});
            res.end(info);
        }
        function checkPassword(password) {
            var exp = /^([a-zA-Z1-9_]){6,12}$/g;
            return !!exp.exec(password);
        }
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