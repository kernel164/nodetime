'use strict';

var assert = require("assert");
var AppRunner = require('./lib/app-runner').AppRunner;



describe('Info', function() {
  it('should be complete', function(done) {
    var appRunner = new AppRunner();

    var infoSample = {
      'Application name': 'TestApp',
      'Hostname': 'dmitris-macbook-pro.fritz.box',
      'OS type': 'Darwin',
      'Platform': 'darwin',
      'Total memory (MB)': 8192,
      'CPU': {},
      'Interfaces': {},
      'OS uptime (Hours)': 161,
      'Node arguments': [],
      'Node PID': 27412,
      'Node uptime (Hours)': 0,
      'Node versions': {},
      'Nodetime version': '0.8.0',
      'Nodetime options': {}
    };

    appRunner.onCommandToSaas(function(command, args) {
      if(
        command === 'updateData' && 
        args._ns === 'info')
      { 
        var complete = true;
        for(var field in infoSample) {
          if(args[field] === undefined) {
            complete = false;
            break;
          }
        }

        assert.ok(complete);

        appRunner.stop(done);
      }
    });

    var options = {
      appName: 'express'
    };
    appRunner.start(options);
  });
});
