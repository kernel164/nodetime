var nodetime = require('../../index.js');
nodetime.profile({
  debug: true,
  server: 'http://localhost:3000',
  accountKey: 'a66a049ac2fee5931e0bf3843fc717702d25d80d', // dev
  appName: 'TestApp'
});


var http = require('http');
var express = require('express');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

app.set('views', __dirname);
app.set('view options', {layout: false});

app.get('/', function(req, res){
  res.render('socketio.ejs');
});

server.listen(4000);


io.sockets.on('connection', function (socket) {
  socket.on('ping', function (data) {
    socket.emit('pong', data + ' pong');
  });
});

console.log('socket.io app started');

