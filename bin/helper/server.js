var fs = require("fs");
var mime = require("mime");
var path = require("path");
var handle404 = require('./handel404').handle404;
function serverStatic(response, cache, absPath) {
    if (cache[absPath]) {
        sendFile(response, absPath, cache[absPath]);
    } else {
        fs.exists(absPath, function (exists) {
            if (exists) {
                fs.readFile(absPath, function (err, data) {
                    if (err) {
                        handle404(response);
                    } else {
                        cache[absPath] = data;
                        sendFile(response, absPath, data);
                    }
                });
            } else {
                handle404(response);
            }
        });
    }
}

function sendFile(response, filePath, fileContents) {
    response.writeHead(
        200,
        {
            'Content-Type': mime.lookup(path.basename(filePath))
        }
    );
    response.end(fileContents);
}

exports.serverStatic = serverStatic;
exports.sendFile = sendFile;