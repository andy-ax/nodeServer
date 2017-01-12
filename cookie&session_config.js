var cookieMod = require('./bin/helper/cookie').Cookie;
var sessionMod = require('./bin/helper/session');
var cache = require('./cache&storage').cache;

var init = function () {
    //cookie配置
    cookieMod.setOption({
        maxAge: 1000 * 60 * 60 * 24 * 30,//cookie保存时长
        domain: '127.0.0.1',
        path: '/',//路径，子路径都可以得到该cookie
        httpOnly: false//只在http下保存cookie
    });

    //session expires配置
    sessionMod.configExpires(20 * 60 * 1000);

    //cookie检测及处理
    cookieMod.cookieConfig('isVisit', function (self) {
        var visitTime = parseInt(self.req.cookie.isVisit);
        self.cookie.push(cookieMod.buildCookie('isVisit',visitTime+1));
    }, function (self) {
        self.cookie.push(cookieMod.buildCookie('isVisit',1));
    });
    // cookieMod.cookieConfig('s_id', function (self) {
    //     //session已存在 ? session 未超时且正确 ? 更新超时时间 : 重新生成session : 重新生成session
    //     sessionMod.checkSession(self.req.cookie['s_id'],function (session) {
    //         self.cookie.push(cookieMod.buildCookie('s_id',session.s_id,{
    //             maxAge:session.cookie.expire
    //         }));
    //     }, function () {
    //         sessionSet(self);
    //     });
    // },function (self) {
    //     sessionSet(self);
    // });
};

// function sessionSet(self) {
//     var user = self['user'];
//     if (user && cache[user]) {
//         var session_obj = sessionMod.generateSession();
//         self.cookie.push(cookieMod.buildCookie(
//             's_id',
//             session_obj.s_id,
//             {
//                 maxAge:session_obj.cookie.expire
//             }
//         ));
//         session_obj.user = user;
//     }
// }

exports.config = init;