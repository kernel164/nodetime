'use strict';

var assert = require("assert");
var memwatch = require('memwatch');
var AppRunner = require('./lib/app-runner').AppRunner;
var LoadTest = require('./lib/load-test').LoadTest;

describe('Memory leaks', function() {
  var duration = 70; // seconds

  var sizeDiffWithoutNodetime;
  var sizeDiffWithNodetime;

  it.skip('short test without nodetime', function(done) {
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
      var hd = new memwatch.HeapDiff();

      loadTest.run(null, duration, 100, function(err) {
        if(err) return done(err);

        memwatch.gc();

        setTimeout(function() {
          var hdResult = hd.end()
          sizeDiffWithoutNodetime = hdResult.after.size_bytes - hdResult.before.size_bytes;
          console.log('heapdiff without nodetime');
          console.log(require('util').inspect(hdResult, true, 100, true));
          assert.ok(sizeDiffWithoutNodetime < 4000000); // adjust this size, when the right size is known

          appRunner.stop(function() {
            done();
          });
        }, 5000);
      });
    });
  });

  it.skip('short test with nodetime', function(done) {
    var appRunner = new AppRunner();
    var loadTest = new LoadTest();

    var options = {
      appName: 'express',
      operations: {
        'redis-set': 100
      }
    };

    appRunner.start(options, function(err) {
      var hd = new memwatch.HeapDiff();

      loadTest.run(null, duration, 100, function(err) {
        if(err) return done(err);

        memwatch.gc();

        setTimeout(function() {
          var hdResult = hd.end()
          sizeDiffWithNodetime = hdResult.after.size_bytes - hdResult.before.size_bytes;
          console.log('heapdiff with nodetime');
          console.log(require('util').inspect(hdResult, true, 100, true));
          assert.ok(sizeDiffWithNodetime < 4000000); // adjust this size, when the right size is known

          appRunner.stop(function() {
            done();
          });
        }, 5000);
      });
    });
  });


  it.skip('should be small heap size difference', function(done) {
    assert.ok(sizeDiffWithNodetime - sizeDiffWithoutNodetime < 10000);
  });

});




