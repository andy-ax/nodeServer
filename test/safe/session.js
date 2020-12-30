let crypto = require('crypto');
let session = {};
let EXPIRES = 1000*60*60*24;

//该值传到cookie作为session_id
function sign(val, secret) {
    return val+'.'+crypto.
        createHmac('sha256', secret).
        update(val).
        digest('base64').
        replace(/\=+$/, '');
}
//判断客户发来的session_id与本地的签名是否一致
function unsign(val, secret) {
    var str = val.slice(0, val.lastIndexOf('.'));
    return sign(str, secret) === val ? str : false;
}
function getIP(req) {
    var ip = req.headers['x-forwarded-for'] ||
        req.ip ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress || '';
    if(ip.split(',').length>0){
        ip = ip.split(',')[0]
    }
    return ip.substr(ip.lastIndexOf(':')+1,ip.length);
}
function generateID() {

}
