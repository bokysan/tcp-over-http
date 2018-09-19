**DECEASED** This project is archived and done for, as there are much better alternatives available nowdays.




tcp-over-http
=============

Use HTTP Upgrade as a neat trick to push TCP over HTTP. It uses node.js as a backend.
This is best suited for the following purposes:
- you want to limit the number of ports you are using on your server
- you only have one IP and want to operate several services on a limited set of ports (e.g. most hotels, airports will block anything other than 80/443, but you'd like to use OpenVPN, your SMTP and IMAP server *and* serve a secure web site)

Please note that no security is implemented in node.js server -- it is left up to you to implement it in the underlying protocol. If you are using OpenVPN, SMTP, IMAP, POP3... this won't be an issue, but make sure you don't forward connections to open services.


server.js
---------

Starting a server is trivial:
    nodejs server.js

This will by default:
- listen on port 8800
- connect to localhost:1194 (OpenVPN IANA assigned port)

You can modify this by specify the start-up parameters, for example:
    nodejs server.js www.google.com:80 8888

This will start the server on port 8888 and forward all connections to Google.


client.js
---------

Clint can operate in two modes:
- as a command-line stream-through-proxy (e.g. if your app has a "connect via" command)
- as a "server" (e.g. listening to connections on localhost)

### Running as a command
To run it as a command, do the following:
    nodejs client.js <url>

For example, if your server is started with `nodejs server.js www.google.com 80` you could try this:
    echo "GET /" | node.js client.js http://localhost:8800/

This should get you the hope page of Google.

### Running the server
To start up the server, do the following:
    nodejs client.js <url> <port>

For example:
    nodejs client.js http://localhost:8800/ 1234

    telnet localhost 2134
    GET /

The net effect is about the same. Which option you use depends on your end software.

To set up node.js as a service on your server, check the internets, I found one nice tutorial here: http://kvz.io/blog/2009/12/15/run-nodejs-as-a-service-on-ubuntu-karmic/

OpenVPN (and other blocked services)
-------

If your hotel/provider... is using deep packet inspection and blocking OpenVPN, this method will allow you to wrap your OpenVPN connection inside a HTTP/SSL session. This should make it virtually indistinguisable from regular HTTPS traffic at the expense of extra processing power required to encrypt everything twice.

Homework
--------

This service will just forward certain ports through HTTP. Later on we could use different headers / upgrade protocol names for setting up different connection types: e.g. it would seem quite trivial to implement a SOCKS proxy over HTTP by using this https://gist.github.com/telamon/1127459

Patches welcome.
