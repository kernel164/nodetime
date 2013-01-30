'use strict';

var assert = require("assert");
var AppRunner = require('./lib/app-runner').AppRunner;



describe('Agent API', function() {
  it('should return the same object if required multiple times', function() {
    var nodetime = require('../index');
    var nodetime2 = require('../index');
    assert.equal(nodetime, nodetime2);
  });


  it('should send the accountKey and appName with push and pull requests');
  // use onRequestToSaas to check

  it('should send the new appName in info message', function(done) {
    var appRunner = new AppRunner();

    appRunner.onCommandToSaas(function(command, args) {
      if(
        command === 'updateData' && 
        args._ns === 'info' &&
        args['Application name'] === 'TestApp2')
      {
        appRunner.stop(function(err) {
          done();
        });
      }
    });

    var options = {
      appName: 'express'
    };
    appRunner.start(options, function(err) {
      var agent = appRunner.getAgent();
      agent.switchApp('TestApp2');   
    });
  });


  it('should aggregate metrics correctly');


  // free version
  it('should get the session id and use it');
});

