var http = require('http');
var socketio = require('socket.io');

var io,
    guestNumber = 1,
    //用户名
    nickNames = {},
    namesUsed = [],
    currentRoom = {};

exports.listen = function (server) {

    io = socketio.listen(server);
    io.set('log level', 1);

    io.sockets.on('connection', function (socket) {
        //分配访客名
        guestNumber = assignGuestName(
            socket, guestNumber, nickNames, namesUsed
        );
        //在用户连接上时分配到聊天室Lobby
        joinRoom(socket, 'Lobby');
        //处理用户的消息，更名，聊天室的创建和变更
        handleMessageBroadcasting(socket, nickNames);
        handleNameChangeAttempts(socket, nickNames, namesUsed);
        handleRoomJoining(socket);

        //用户发出请求时，向其提供已被占用的聊天室列表
        socket.on('rooms', function () {
            socket.emit('rooms', io.sockets.manager.rooms);
        });
        //定义用户断开连接后的清除逻辑
        handleClientDisconnection(socket, nickNames, namesUsed);
    });
};

function assignGuestName(
    socket, guestNumber, nickNames, namesUsed
) {
    //分配访客名
    var name = 'Guest' + guestNumber;
    //用id保存用户名
    nickNames[socket.id] = name;
    //通知用户
    socket.emit('nameResult', {
        success: true,
        name: name
    });
    //保存到已被占用昵称列表
    namesUsed.push(name);
    //用户计数器自加
    return ++guestNumber;
}

function joinRoom(socket, room) {
    socket.join(room);
    currentRoom[socket.id] = room;
    socket.emit('joinResult', {room: room});
    socket.broadcast.to(room).emit('message', {
        text: nickNames[socket.id] + ' has joined' + room + '.'
    });

    var usersInRoom = io.sockets.clients(room);
}
// var server = http.createServer(function (req, res) {
//     res.writeHead(200,{'Content-Type':'text/plain'});
//     res.end();
// });
// server.on('upgrade',function (req, socket, upgradeHead) {
//     var head = new Buffer(upgradeHead.length);
//     upgradeHead.copy(head);
//     var key = req.headers['sec-websocket-key'];
// });