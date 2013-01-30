'use strict';

var assert = require("assert");
var AppRunner = require('./lib/app-runner').AppRunner;
var LoadTest = require('./lib/load-test').LoadTest;
var timekit = require('timekit');


describe('Performance', function() {
  var duration = 30; // seconds

  var cpuTimeWithoutNodetime;
  var cpuTimeWithNodetime;

  it.skip('test without nodetime', function(done) {
    var appRunner = new AppRunner();
    var loadTest = new LoadTest();

    var options = {
      appName: 'express',
      operations: {
        'redis-set': 100
      },
      noAgent: true
    };

    appRunner.start(options, function(err) {
      var time = timekit.time();
      var cpuTime = timekit.cputime();

      loadTest.run(null, duration, 100, function(err) {
        if(err) return done(err);

        cpuTimeWithoutNodetime = timekit.cputime() - cpuTime;
        console.log('cpu time without nodetime', cpuTimeWithoutNodetime / 1000000);
        console.log('time without nodetime', (timekit.time() - time) / 1000000);
        assert.ok(cpuTimeWithoutNodetime < 15000000); // adjust this size, when the right size is known

        appRunner.stop(function() {
          done();
        });
      });
    });
  });


  it.skip('test with nodetime', function(done) {
    var appRunner = new AppRunner();
    var loadTest = new LoadTest();

    var options = {
      appName: 'express',
      operations: {
        'redis-set': 100
      }
    };

    appRunner.start(options, function(err) {
      var time = timekit.time();
      var cpuTime = timekit.cputime();

      loadTest.run(null, duration, 100, function(err) {
        if(err) return done(err);

        cpuTimeWithNodetime = timekit.cputime() - cpuTime;
        console.log('cpu time with nodetime', cpuTimeWithNodetime / 1000000);
        console.log('time with nodetime', (timekit.time() - time) / 1000000);
        assert.ok(cpuTimeWithNodetime < 20000000); // adjust this size, when the right size is known

        appRunner.stop(function() {
          done();
        });
      });
    });
  });


  it.skip('should be low cpu overhead', function(done) {
    assert.ok(cpuTimeWithNodetime - cpuTimeWithoutNodetime < 5000000);
  });

});