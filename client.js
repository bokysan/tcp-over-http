"use strict";

var http = require('http');
var sys = require('sys');
var net = require('net');
var url = require('url');

var args = process.argv.splice(2);

var options = url.parse(args[0]);
options.headers = {
	'Connection': 'Upgrade',
	'Upgrade': 'TCPoverHTTP'
};

var req = http.request(options);
req.end();

if(args.length > 1) {
	var listen = parseInt(args[1], 10);
	req.on('upgrade', function(res, socket, head) {
		console.log('Connection established. Listening on localhost:' + listen);
		var server = net.createServer(function(c) {
			c.on('data', function(chunk) {
				socket.write(chunk);
			}).on('end', function() {
				socket.end();
			});
			socket.on('data', function(chunk) {
				c.write(chunk);
			}).on('end', function() {
				// don't shut down the server on socket close
				// c.end();
			});
		});

		server.listen(listen, 'localhost');
	}).on('error', function(e) {
		console.log('problem with request: ' + e.message);
	});
} else {
	req.on('upgrade', function(res, socket, head) {
		var stdin = process.stdin;
		var stdout = process.stdout;
		stdin.resume();

		socket.on('data', function(chunk) {
			stdout.write(chunk);
		}).on('end', function() {
			// don't close Stdout, it does not make any sense
			// stdout.end();
		});

		stdin.on('data', function(chunk) {
			socket.write(chunk);
		}).on('end', function() {
			socket.end();
		});
	}).on('error', function(e) {
		console.log('problem with request: ' + e.message);
	});
}