

var express = require('express');
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);

io.on("connection", function(socket) {
	socket.on("login", function(data) {
		console.log(data);
		//socket.broadcast.emit("login", )
	});
});