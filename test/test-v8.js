'use strict';

var assert = require("assert");
var AppRunner = require('./lib/app-runner').AppRunner;


describe('V8 tools', function() {
  it('should generate CPU profile', function(done) {
    var appRunner = new AppRunner();

    appRunner.onCommandToSaas(function(command, args) {
      if(
        command === 'updateData' && 
        args._ns === 'cpu-profiles')
      {
        assert.ok(isCpuProfileComplete(args));
        appRunner.stop(done);
      }
    });

    var options = {
      appName: 'express',
    };
    appRunner.start(options, function() {
      appRunner.sendCommandToAgent('profileCpu', 5);
    });
  });


  it('should generate heap snapshot', function(done) {
    var appRunner = new AppRunner();

    appRunner.onCommandToSaas(function(command, args) {
      if(
        command === 'updateData' && 
        args._ns === 'heap-snapshots')
      {
        assert.ok(isHeapSnapshotComplete(args));
        appRunner.stop(done);
      }
    });

    var options = {
      appName: 'express',
    };
    appRunner.start(options, function() {
      appRunner.sendCommandToAgent('takeHeapSnapshot');
    });
  });


  it('should generate heap metrics', function(done) {
    var appRunner = new AppRunner();

    appRunner.onCommandToSaas(function(command, args) {
      if(
        command === 'updateData' && 
        args._ns === 'metrics' &&
        args.scope === 'Heap Snapshot')
      {
        appRunner.stop(done);
      }
    });

    var options = {
      appName: 'express',
    };
    appRunner.start(options, function() {
      appRunner.sendCommandToAgent('takeHeapSnapshot');
    });
  });  
});


function isCpuProfileComplete(cpuProfile) {
  var cpuProfileSpec = {
    _id: 'number',
    _label: 'string',
    _ts: 'number',
    _ns: 'string',
    root: 'object'
  }

  var complete = true;
  for(var field in cpuProfileSpec) {
    if(!cpuProfile[field] || typeof(cpuProfile[field]) !== cpuProfileSpec[field]) {
      complete = false;
      break;
    }
  }

  return complete;
}


function isHeapSnapshotComplete(heapSnapshot) {
  var heapSnapshotSpec = {
    _id: 'number',
    _label: 'string',
    _ts: 'number',
    _ns: 'string',
    'Retainers': 'object', 
    'Objects': 'object'
  }

  var complete = true;
  for(var field in heapSnapshotSpec) {
    if(!heapSnapshot[field] || typeof(heapSnapshot[field]) !== heapSnapshotSpec[field]) {
      complete = false;
      break;
    }
  }

  return complete;
}
