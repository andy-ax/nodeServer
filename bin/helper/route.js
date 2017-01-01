var routes = {
    GET: [],
    POST: [],
    PUT: [],
    DELETE: []
};
var rule = [];
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

    rule.forEach(function (ruleObj) {
        if (path.indexOf(ruleObj.execStr) > -1) {
            path = path.replace(ruleObj.regExp,ruleObj.replaceRegExp);
        }
    });
    exp = new RegExp('^' + path + '$');

    routes[type].push({
        path: exp,
        action: action
    });
};

exports.post = function (path, action) {
    use(path, 'post', action);
};
exports.delete = function (path, action) {
    use(path, 'delete', action);
};
exports.put = function (path, action) {
    use(path, 'put', action);
};
exports.get = function (path, action) {
    use(path, 'get', action);
};

/**
 *
 * @param {string} execStr
 * @param {RegExp} regExp
 * @param {string} replaceRegExp
 */
var addRule = function (execStr, regExp, replaceRegExp) {
    rule.push({
        execStr: execStr,
        regExp: regExp,
        replaceRegExp: replaceRegExp
    });
};

/**
 *
 * @param req
 * @param {string} pathname
 * @return {{action: *, args: (*)} || boolean}
 */
var checkPath = function(req, pathname) {
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
            args = [].concat(result);

            return {
                action: route.action,
                args: args
            };
        }
    }
    return false;
};

exports.addRule = addRule;
exports.checkPath = checkPath;
exports.use = use;