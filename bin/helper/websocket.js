/**
 * Created by andy on 2016/12/6.
 */
var server = http.createServer(function (req, res) {
    res.writeHead(200,{'Content-Type':'text/plain'});
    res.end();
});
server.on('upgrade',function (req, socket, upgradeHead) {
    var head = new Buffer(upgradeHead.length);
    upgradeHead.copy(head);
    var key = req.headers['sec-websocket-key'];
});