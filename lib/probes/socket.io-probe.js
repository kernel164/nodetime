'use strict';


function SocketioProbe(agent) {
  this.agent = agent;

  this.packages = ['socket.io'];
  this.attached = false;
}
exports.SocketioProbe = SocketioProbe;



SocketioProbe.prototype.attach = function(obj) {
  var self = this;

  if(obj.__nodetimeProbeAttached__) return;
  obj.__nodetimeProbeAttached__ = true;

  var proxy = self.agent.proxy;
  var profiler = self.agent.profiler;

  var socketCount = undefined;

  self.agent.timers.setInterval(function() {
    if(socketCount !== undefined) {
      self.agent.metric('Socket.io', 'Socket count', socketCount, undefined, 'avg');
    }
  }, 60000);


  proxy.after(obj, 'listen', function(obj, args, ret) {
    if(!ret.sockets) return;

    if(socketCount === undefined) {
      socketCount = 0;
    }

    proxy.before(ret.sockets, ['on', 'addListener'], function(obj, args) {
      if(args[0] !== 'connection') return;

      proxy.callback(args, -1, function(obj, args) {
        if(!args[0]) return;

        var socket = args[0];     

        socketCount++;
        socket.on('disconnect', function() {
          socketCount--;
        });

        /*proxy.before(socket, ['on', 'addListener'], function(obj, args) {
          if(self.agent.profiler.paused) return;

          var msg = args[0];
          var time = undefined;

          proxy.callback(args, -1, function(obj, args) {
            time = samples.time("Socket.io", msg, true);
          });

          proxy.after(socket, ['emit', 'send'], function(obj, args) {
            if(!time || !time.done()) return;
  
            samples.add(time, {'Type': 'Socket.io', 
              'Message': msg, 
              'Namespace': socket.namespace ? socket.namespace.name : undefined}, 
              'Socket.io: ' + msg);
          });
        });*/
      });
    });
  });
};

