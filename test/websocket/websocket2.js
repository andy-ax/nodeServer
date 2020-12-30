const crypto = require('crypto');
const http = require('http');

let server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
});
server.listen(12010);

server.on('upgrade', (req, socket, upgradeHead)=>{
    let head = Buffer.alloc(upgradeHead.length,upgradeHead);
    upgradeHead.copy(head);
    let key = req.headers['sec-websocket-key'];
    let shasum = crypto.createHash('sha1');
    let protocol = 'chat';
    key = shasum.update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11').digest('base64');
    let headers = [
        'HTTP/1.1 101 Switching Protocols',
        'Upgrade: websocket',
        'Connection: Upgrade',
        'Sec-WebSocket-Accept: ' + key,
        // 'Sec-WebSocket-Protocol: ' + protocol,
        'Content-Type: text/plain'
    ];

    socket.setNoDelay(true);
    socket.write(headers.concat('', '').join('\r\n'));

    // WebSocket.prototype.setSocket = (socket)=>{
    //     this.socket = socket;
    //     this.socket.on('data', this.receiver);
    // };
    // WebSocket.prototype.send = (data) => {
    //     this._send(data);
    // };
    // let websocket = new WebSocket();
    // websocket.setSocket(socket);
    socket.onopen = (data) => {
        console.log('hello')
    };
    socket.on('data', data=>{
        console.log('get data');
    });
    socket.on('end', data=>{
        console.log('end');
    });
    let buffers = [];
    req.on('data', chunk=>{
        buffers.push(chunk);
        console.log(chunk)
    }).on('end', ()=>{
        let buffer = Buffer.concat(buffers);
        let str = buffer.toString('utf-8');
        console.log(str);
        console.log(str.length);
    });

    socket.on('message', msg=>{
        console.log('msg');
    });
});