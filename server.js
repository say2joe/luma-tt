#!/usr/bin/env node
var fs = require('fs'),
    http = require('http');

var port = 8888,
    webroot = 'public',
    routes = {
        '/tasks/': function(req, res) {
            res.writeHead(200);
            res.end('not implemented');
        }
    };

http.createServer(function(req, res) {
    var url = req.url.replace(/^(.+?)\?.*/, '$1');
    if (routes[url]) {
        // Server-side route
        routes[url](req, res);
    } else {
        // Static asset
        if (url == '/') {
            url = '/index.html';
        }
        fs.readFile(webroot + url, function(err, data) {
            if (err) {
                res.writeHead(404);
                res.end(JSON.stringify(err));
            }
            else {
                res.writeHead(200);
                res.end(data);
            }
        });
    }
}).listen(port);

console.log('Server is running at http://127.0.0.1:%d', port);
