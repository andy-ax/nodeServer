//存储session
var sessions = {};

var EXPIRES = 20 * 60 * 1000;

/*
 * session -> {
 *     s_id: string,
 *     cookie: {
 *         expire: Date,
 *         user: String
 *     }
 * }
 */

//设定超时时间
/**
 *
 * @param {number} expires
 */
var configExpires = function (expires) {
    if (typeof expires === 'number') {
        EXPIRES = expires;
    } else {
        throw new Error('expires must be number!!!');
    }
};

//生成session
/**
 *
 * @return {{s_id: *, cookie: {expire: *}}}
 */
var generateSession = function (user) {
    var newSession = {
        //生成唯一id
        s_id: generateSId(),
        user: user,
        cookie: {
            //设置cookie超时时间
            expire: setExpiresTime()
        }
    };
    //保存在缓存中
    sessions[newSession.s_id] = newSession;

    return newSession;
};

//检查session
/**
 *
 * @param {string} s_id
 * @param {function} [resolve]
 * @param {function} [reject]
 */
var checkSession = function (s_id, resolve, reject) {
    var session = sessions[s_id];
    if (session) {
        var date = (new Date()).getTime();
        if (session.cookie.expire > date) {
            session.cookie.expire = date + EXPIRES;
            resolve && resolve(session);
        } else {
            delete sessions[s_id];
            reject && reject();
        }
    } else {
        reject && reject();
    }
};


//生成id
function generateSId () {
    return (new Date()).getTime() + Math.random();
}
//设置超时时间
function setExpiresTime () {
    return (new Date()).getTime() + EXPIRES;
}

exports.configExpires = configExpires;
exports.generateSession = generateSession;
exports.checkSession = checkSession;