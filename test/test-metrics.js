'use strict';

var assert = require("assert");
var AppRunner = require('./lib/app-runner').AppRunner;



describe('Metrics', function() {
  it('should be sent after agent starts', function(done) {
    var appRunner = new AppRunner();

    var metrics = {
      'OS:Load average': false,
      'OS:Free memory': false,
      'Process:Node RSS': false,
      'Process:V8 heap used': false,
      'Process:V8 heap total': false
    }

    appRunner.onCommandToSaas(function(command, args) {
      if(
        command === 'updateData' && 
        args._ns === 'metrics')
      { 
        if(!metrics[args.scope + ':' + args.name]) {
          metrics[args.scope + ':' + args.name] = true;
        }

        // check if all metrics have arrived
        var complete = true;
        for(var prop in metrics) {
          if(!metrics[prop]) {
            complete = false;
            break;
          }
        }

        if(complete) {
          appRunner.stop(done);
        }
      }
    });

    var options = {
      appName: 'express'
    };
    appRunner.start(options);
  });



  it('should be sent in one minute', function(done) {
    var appRunner = new AppRunner();

    var metrics = {
      'OS:Load average': false,
      'OS:Free memory': false,
      'Process:Node RSS': false,
      'Process:V8 heap used': false,
      'Process:V8 heap total': false,
      'Process:CPU time': false,
      'Process:Data written to STDOUT per minute': false,
      'Process:Data written to STDERR per minute': false,
      'Process:Performance index': false,
      'Garbage Collection:Full GCs per minute': false,
      'Garbage Collection:Incremental GCs per minute': false,
      'Garbage Collection:Used heap size change per minute': false
    }

    appRunner.onCommandToSaas(function(command, args) {
      if(
        command === 'updateData' && 
        args._ns === 'metrics')
      { 
        if(!metrics[args.scope + ':' + args.name]) {
          metrics[args.scope + ':' + args.name] = true;
        }

        // check if all metrics have arrived
        var complete = true;
        for(var prop in metrics) {
          if(!metrics[prop]) {
            complete = false;
            break;
          }
        }

        if(complete) {
          appRunner.stop(done);
        }
      }
    });

    var options = {
      appName: 'express'
    };
    appRunner.start(options);
  });  
});
