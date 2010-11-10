var express = require('express'),
    io = require('socket.io');

var app = express.createServer();

app.configure(function(){
  app.use(express.staticProvider(__dirname));
  app.use(express.logger());
});

app.listen(5088);

var socket = io.listen(app);
socket.on('connection', function(client) {
  client.on('message', function(pos) {
    client.broadcast(pos);
  });
});
