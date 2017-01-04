var fileMod = require('../bin/helper/file');

var readFile = '/Users/andy/Dropbox/html/jquery.js';
var writeFile = '../public/javascripts/jquery.js';
fileMod.copyFile(readFile,writeFile);