var FileError = function (msg) {
    this.name = 'FileError';
    this.message = msg;
};

FileError.prototype = new Error();

exports.FileError = FileError;