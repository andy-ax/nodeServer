let http = require("http");
let agent = new http.Agent({
    maxSockets: 5,
});
let options = {
    hostname: '127.0.0.1',
    port: 8145,
    path: '/',
    method: 'GET',
    agent: agent,
};

let req = http.request(options, res=>{
    console.log(res);
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: '+ JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', chunk=>{
        console.log(chunk);
    })
});
req.end();