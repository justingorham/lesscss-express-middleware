var express = require('express');
var lesscss = require('./index.js');
var path = require('path');

var app = express();
var lessCssOptions = {
        lessPhysicalPath: path.join(__dirname, 'client', 'less'),
        compiledPhysicalPath: path.join(__dirname, 'client', 'css', 'c'),
        lessServerPath: '/less',
        cssServerPath: '/css/c',
        compilerOptions: {
            compress: true,
            ignoreList: ['lib', 'main', 'static']
        }
    };

var lessFunctions = lesscss(app, lessCssOptions);
	
return app;