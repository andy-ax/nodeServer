let http = require('http');

var onRequest = function (req, res) {
    console.log(req.url);
    console.log(req.headers.cookie);
    res.end('hello');
};

http.createServer(onRequest).listen(8000, ()=>{
    console.log('server bound')
});