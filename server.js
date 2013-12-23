"use strict";

var http = require('http');
var net = require('net');

var args = process.argv.splice(2);
var port = 1194;
var host = 'localhost';
var listenPort = 8800;

if(args.length > 0) {
	var connectTo = args[0].split(':');
	host = connectTo[0]
	if(connectTo.length > 1) { port = parseInt(connectTo[1], 10); }
}

if(args.length > 1) {
	listenPort = parseInt(args[1], 10);
}

var srv = http.createServer(function(req, res) {
	res.writeHead(404, {'Content-Type': 'text/plain'});
	res.end('Not found');
});
srv.on('upgrade', function(req, socket, head) {
	if('TCPoverHTTP' != req.headers.upgrade) {
		socket.end(
			'HTTP/1.1 404 Not Found\r\n' +
			'Content-Type: text/plain\r\n' +
			'Connection: close\r\n' +
			'Content-Length: 9\r\n' +
			'\r\n' +
			'Not found'
		);
	}

	// request is the arguments for the http request, as it is in the request event.
	// socket is the network socket between the server and client.
	// head is an instance of Buffer, the first packet of the upgraded stream, this may be empty.
	socket.write(
		'HTTP/1.1 101 Switching Protocols\r\n' +
		'Upgrade: TCPoverHTTP\r\n' +
		'Connection: Upgrade\r\n' +
		'\r\n');
	var remote = net.connect(port, host);
	socket.pipe(remote);
	remote.pipe(socket);
});

console.log('To change listening port or target connection, start like this:');
console.log('	nodejs server.js <host>:<port> [<listeningPort>]');
console.log('');
console.log('For example:');
console.log('	nodejs server.js www.google.com:80');
console.log('');
console.log('Listening on port %d, will forward connections to %s:%d...', listenPort, host, port);
console.log('Now connect with "nodejs client.js http(s)://<host>:<port>/"');
srv.listen(listenPort);