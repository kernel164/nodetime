'use strict';

var util = require('util');
var http = require('http');
var zlib = require('zlib');
var EventEmitter = require('events').EventEmitter;


function SaasMock() {
  EventEmitter.call(this);

  this.server = undefined;
}
util.inherits(SaasMock, EventEmitter);
exports.SaasMock = SaasMock;



SaasMock.prototype.onCommand = function(callback) {
  this.on('command', callback);
};


SaasMock.prototype.sendCommand = function(command, args) {
  this.emit('sendCommand', command, args);
};


SaasMock.prototype.mock = function(callback) {
  var self = this;

  self.server = http.createServer(function(req, res) {
    self.emit('request', req, res);

    if(req.url.match(/^\/agent\/push/)) {
      parseBody(req, function(err, body) {  
        body.forEach(function(command) {
          self.emit('command', command.payload.cmd, command.payload.args);
        });

        sendJson(res, {});
      });
    }
    else if(req.url.match(/^\/agent\/poll/)) {
      var pollTimeout = setTimeout(function() {
        sendJson(res, []);
      }, 60000);

      self.on('sendCommand', function(command, args) {
        clearTimeout(pollTimeout);

        var msg = {
          payload: {
            cmd: command, 
            args: args
          },
          ts: Date.now()
        };

        sendJson(res, [msg]);
      });

      self.on('cancelPoll', function(command, args) {
        clearTimeout(pollTimeout);
        sendJson(res, []);
      });
    }
  });

  self.server.listen(4000, function() {
    console.log('SaaS mock server started');
    callback();
  });
};


SaasMock.prototype.unmock = function(callback) {
  this.emit('cancelPoll');
  this.removeAllListeners();
  this.server.close(function() {
    console.log('SaaS mock server stopped');
    callback();
  });
};


function sendJson(res, obj) {
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify(obj));
}


function parseBody(req, callback) {
  var buf = new Buffer(0);

  req.on('data', function(chunk) { 
    buf = Buffer.concat([buf, chunk]);
  });

  req.on('end', function() {
    if(req.headers['content-encoding'] === 'gzip') {
      zlib.gunzip(buf, function(err, buf) {
        if(err) return callback(err);

        callback(null, JSON.parse(buf.toString('utf8')));
      });
    }
    else {
      callback(null, JSON.parse(buf.toString('utf8')));
    }
  });
};

