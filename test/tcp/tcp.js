let net = require('net');

var server = net.createServer(socket=>{
    socket.on('data', data=>{
        socket.write('hello');
    });

    socket.on('end', ()=>{
        console.log('close');
    });

    socket.write('start');
});

server.listen(8000, ()=>{
    console.log('server bound')
});