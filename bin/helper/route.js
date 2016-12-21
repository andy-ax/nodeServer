var routes = {
    GET: [],
    POST: [],
    PUT: [],
    DELETE: []
};
//映射方法
//:username关键字匹配用户名
/**
 *
 * @param {string} path
 * @param {string} type
 * @param {function} action
 */
var use = function (path, type, action) {
    //noinspection JSDuplicatedDeclaration
    var type = type.toUpperCase();
    var exp;

    if (path.indexOf(':username') > -1) {
        path = path.replace(/\:username/g,'([0-9a-zA-Z_]+)');
    }
    exp = new RegExp('^' + path + '$');

    routes[type].push({
        path: exp,
        action: action
    });
};

/**
 *
 * @param req
 * @param {string} pathname
 * @return {{action: *, args: (*)} || boolean}
 */
var pathSet = function(req, pathname) {
    var route,
        i,
        len,
        result,
        args,
        type = req.method;

    for (i = 0,len = routes[type].length; i < len; i++) {
        route = routes[type][i];
        result = route.path.exec(pathname);
        if (result) {
            route.path.lastIndex = 0;
            result.shift();
            //将req,res与匹配项叠加
            args = Array.prototype.slice.call(arguments,0).concat(result);

            return {
                action: route.action,
                args: args
            };
        }
    }
    return false;
};

exports.pathSet = pathSet;
exports.use = use;