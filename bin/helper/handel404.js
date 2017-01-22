exports.handle404 = function(res,msg) {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.write('Error 404: resource not found.');
    res.end(msg||'');
};