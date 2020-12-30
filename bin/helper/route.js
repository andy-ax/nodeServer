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
 * 替换路由的匹配字段改为真正的路由
 * @param {string} path
 * @param {string} type
 * @param {function} action
 */
var use = function (path, type, action) {
    //noinspection JSDuplicatedDeclaration
    type = type.toUpperCase();
    var exp;

    // expStr: 判断该路由是否匹配这个路由正则
    // regExp: 如果匹配，则将该段用于匹配的文字替换为真正的路由
    // replaceRegExp: 真正的路由
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
 * 向路由正则添加规则
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
 * 判断该路径匹配哪个路由
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
            console.log(result)
            console.log(route.path)
            console.log(pathname)
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