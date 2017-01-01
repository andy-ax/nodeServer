var cookieMod = require('./bin/helper/cookie').Cookie;
var sessionMod = require('./bin/helper/session');
var cache = require('./cache&storage').cache;

var init = function () {
    //cookie配置
    cookieMod.setOption({
        maxAge: 60 * 60 * 24 * 30,//cookie保存时长
        domain: '127.0.0.1',
        path: '/',//路径，子路径都可以得到该cookie
        httpOnly: true//只在http下保存cookie
    });

    //session expires配置
    sessionMod.configExpires(20 * 60 * 1000);

    //cookie检测及处理
    cookieMod.cookieConfig('isVisit', function (instant) {
        if (!instant.msg) {
            instant.msg = {};
        }
        instant.cookie.push(cookieMod.buildCookie('isVisit',1));
    }, function (instant) {
        instant.cookie.push(cookieMod.buildCookie('isVisit',1));
    });
    cookieMod.cookieConfig('s_id', function (instant) {
        sessionMod.checkSession(instant.req.cookie['s_id'],function (session) {
            instant.cookie.push(cookieMod.buildCookie('s_id',session.s_id,{
                maxAge:session.cookie.expire
            }));
        }, function () {
            sessionSet(instant);
        });
    },function (instant) {
        sessionSet(instant);
    });
};

function sessionSet(instant) {
    var user = instant['user'];
    if (user && cache[user]) {
        var session_obj = sessionMod.generateSession();
        instant.cookie.push(cookieMod.buildCookie(
            's_id',
            session_obj.s_id,
            {
                maxAge:session_obj.cookie.expire
            }
        ));
        session_obj.user = user;
    }
}

exports.config = init;