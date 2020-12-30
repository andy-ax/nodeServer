let http = require("http");

let port = 8145;

http.createServer((req, res)=>{
    res.end('连接');
}).listen(port, ()=>{
    console.log('服务器启动');
});
