'use strict';

var assert = require("assert");
var AppRunner = require('./lib/app-runner').AppRunner;
var LoadTest = require('./lib/load-test').LoadTest;


describe('Probes', function() {
  it('should generate realtime samples', function(done) {
    var appRunner = new AppRunner();
    var loadTest = new LoadTest();

    var samples = {
      'HTTP Server': false,
      'HTTP Client: GET': false,
      'File System: mkdir': false,
      'File System: rmdir': false,
      'File System: mkdirSync': false,
      'File System: rmdirSync': false,
      'Redis: mget': false,
      'Redis: keys': false,
      'MongoDB: insert': false,
      'MongoDB: find': false,
      'Memcached: set': false,
      'Memcached: get': false,
      'Memcached: del': false,
      'MySQL: query': false,
      'PostgreSQL: query': false
    };

    appRunner.onCommandToSaas(function(command, args) {
      if(
        command === 'updateData' && 
        args._ns === 'samples')
      {
        if(!samples[args._group]) {
          samples[args._group] = true;
        }

        // check if all samples have arrived
        var complete = true;
        for(var group in samples) {
          if(!samples[group] || !isSampleComplete(args)) {
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
      appName: 'http',
      operations: {
        'fs': 1,
        'http': 1,
        'redis': 1,
        'mongodb': 1,
        'mysql2': 1,
        'pg': 1,
        'pg-evented': 1,
        'memcached': 1,
        'memcache': 1
      },
      executionType: 'parallel'
    };
    appRunner.start(options, function() {
      appRunner.sendCommandToAgent('resume');

      // let agent resume
      setTimeout(function() {
        loadTest.one(null, function(err) {
          if(err) return done(err);
        }, 2000);
      });

      setTimeout(function() { 
        for(var group in samples) {
          if(!samples[group])
            console.log('missing sample', group)
        }
      }, 30000);
    });
  });


  it('should generate historical samples');


  it('should generate call metrics', function(done) {
    var appRunner = new AppRunner();
    var loadTest = new LoadTest();

    var scopes = [
      'HTTP Server',
      'HTTP Client',
      'HTTP Client/GET',
      'File System',
      'File System/mkdir',
      'File System/rmdir',
      'File System/mkdirSync',
      'File System/rmdirSync',
      'Redis',
      'Redis/mget',
      'Redis/keys',
      'MongoDB',
      'MongoDB/find',
      //'MongoDB/insert',
      'Memcached',
      'Memcached/set',
      'Memcached/get',
      'Memcached/del',
      'MySQL',
      'PostgreSQL'
    ];

    var metrics = {};
    scopes.forEach(function(scope) {
      metrics[scope + ':' + 'Requests per minute'] = false;
      metrics[scope + ':' + 'Errors per minute'] = false;
      metrics[scope + ':' + 'Average response time'] = false;
      metrics[scope + ':' + 'Response time 95th percentile'] = false;
      metrics[scope + ':' + 'Average CPU time'] = false;
    })


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
      appName: 'express',
      operations: {
        'fs': 1,
        'http': 1,
        'redis': 1,
        'mongodb': 1,
        'mysql2': 1,
        'pg': 1,
        'pg-evented': 1,
        'memcached': 1,
        'memcache': 1
      },
      executionType: 'parallel'
    };
    appRunner.start(options, function() {
      setTimeout(function() {
        loadTest.one(null, function(err) {
          if(err) return done(err);
        }, 2000);
      });
   
      setTimeout(function() { 
        for(var m in metrics) {
          if(!metrics[m])
            console.log('missing metric', m)
        }
      }, 70000);
    });
  });
});


function isSampleComplete(sample) {
  var sampleSpec = {
    'Type': 'string',
    //'Stack trace': 'array',
    _group: 'string',
    _version: 'string',
    _ns: 'string',
    _id: 'number',
    _begin: 'number',
    _end: 'number',
    _ms: 'number',
    _ts: 'number',
    _cputime: 'number',
    'Response time (ms)': 'number',
    'Timestamp (ms)': 'number',
    'CPU time (ms)': 'number',
    //'Bytes read (KB)': 'number',
    //'Bytes written (KB)': 'number',
    //_filtered: 'boolean',
    _label: 'string'
  }

  var complete = true;
  for(var field in sampleSpec) {
    if(typeof(sample[field]) !== sampleSpec[field]) {
      complete = false;console.log(field)
      break;
    }
  }

  return complete;
}
