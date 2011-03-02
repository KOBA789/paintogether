var express = require('express'),
    io = require('socket.io');

var app = express.createServer();

app.configure(function(){
  app.use(express.staticProvider(__dirname));
  app.use(express.logger());
});

app.listen(5088);

var posArray = Array();

var socket = io.listen(app);
socket.on('connection', function(client) {
  console.log('Connected from ' + client.request.socket.remoteAddress);
  for (var i = 0; i < posArray.length; i ++) {
    client.send(JSON.stringify(posArray[i]));
  }
  client.on('message', function(pos) {
    if (pos == 'cls') {
      posArray = Array();
    } else {
      var obj = JSON.parse(pos);
      posArray.push(obj);
    }
    client.broadcast(pos);
  });
});
