var path = require("path");
var crypto = require("crypto");

var WebSocket = function (url) {
    this.options = parseUrl(url);
    this.connect();
};
WebSocket.prototype.onopen = function () {
    //TODO
};
WebSocket.prototype.setSocket = function (socket) {
    this.socket = socket;
};
WebSocket.prototype.connect = function () {
    var self = this;
    var key = new Buffer(this.options.protocolVersion + '-' + Date.now()).toString('base64');
    var shasum = crypto.createHash('sha1');
    var expected = shasum.update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11').digest('base64');

    var options = {
        port: this.options.port,
        host: this.options.hostname,
        headers: {
            'Connection': 'Upgrade',
            'Upgrade': 'websocket',
            'Sec-WebSocket-Version': this.options.protocolVersion,
            'Sec-WebSocket-Key': key
        }
    };

    var req = http.request(options);
    req.end();

    req.on('upgrade', function (res, socket, upgradeHead) {
        //连接成功
        self.setSocket(socket);
        self.onopen();
    })
};

function parseUrl(url) {
    return;
}