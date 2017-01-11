// 需要HTTP 模块来启动服务器和Socket.IO
var http = require('http'), io= require('socket.io');

// 在8080端口启动服务器
var server= http.createServer(function(req, res){
    // 发送HTML的headers和message
    res.writeHead(200,{ 'Content-Type': 'text/html' });
    res.end('<script src="socket.io-1.4.0.js"></script>');
});
server.listen(8080);

// 创建一个Socket.IO实例，把它传递给服务器
var socket= io.listen(server);

// 添加一个连接监听器
socket.on('connection', function(client){

    // 成功！现在开始监听接收到的消息
    client.on('message',function(event){
        console.log('Received message from client!',event);
    });
    client.on('disconnect',function(){
        clearInterval(interval);
        console.log('Server has disconnected');
    });
    // 创建一个定期（每5秒）发送消息到客户端的发送器
    var interval= setInterval(function() {
        client.send('This is a message from the server! ' + new Date().getTime());
    },5000);
});