'use strict';

var SaasMock = require('./saas-mock').SaasMock;


function AppRunner() {
  this.appWrapper = undefined;
  this.saasMock = new SaasMock();
  this.agent = undefined;
  this.active = false;
}
exports.AppRunner = AppRunner;


AppRunner.prototype.setAgent = function(agent) {
  this.agent = agent;
};


AppRunner.prototype.getAgent = function() {
  return this.agent;
};


AppRunner.prototype.onRequestToSaas = function(callback) {
  this.saasMock.on('request', callback);
};


AppRunner.prototype.onCommandToSaas = function(callback) {
  this.saasMock.on('command', callback);
};


AppRunner.prototype.sendCommandToAgent = function(command, args) {
  this.saasMock.sendCommand(command, args);
};


AppRunner.prototype.start = function(options, callback) {
  var self = this;

  if(self.active) return;
  self.active = true;

  // Start SaaS server mock.
  self.saasMock.mock(function() {
    self._start(options, callback);
  });
};


AppRunner.prototype._start = function(options, callback) {
  var self = this;

  callback || (callback = function() {});


  if(!self.agent && !options.noAgent) {
    self.agent = require('../../index.js');
    self.agent.profile({
      debug: true,
      server: 'http://localhost:4000',
      accountKey: 'a66a049ac2fee5931e0bf3843fc717702d25d80d', // dev
      appName: 'TestApp',
      namedTransactions: {                                                                                                                   
        'Test1': "/",
        'Test2': /test2/,
        'Test3': "/test3",
        'Test4': /test4/,
        'Test5': "/test5",
        'Test6': /test6/,
        'Test7': "/test7",
        'Test8': /test8/,
        'Test9': "/test9",
        'Test10': /test10/
      }
    });
  }

  // Create an instance of application wrapper.
  self.appWrapper = require('../apps/' + options.appName + '.js');

  // Initialize wrapper. This is needed so that the initialization of the server
  // is inside a closure and will not impact next tests.
  self.appWrapper.load();

  // Set how operations are executed, e.g. parallel, nested.
  if(options.executionType) {
    self.appWrapper.setExecutionType(options.executionType);
  }

  // Set operation wrappers.
  for(var operation in options.operations) {
    var count = options.operations[operation];
    for(var i = 0; i < count; i++) {
      var operationWrapper = require('../operations/' + operation + '.js');
      operationWrapper.load();

      self.appWrapper.addOperationWrapper(operationWrapper);
    }
  }

  // Start the server
  var port = options.port || 3003;
  self.appWrapper.start(port, function(err) {
    if(err) return callback(err);

    setTimeout(function() {
      console.log('server ' + options.appName + ' started on ' + port);

      callback();
    }, 2000);
  });
};



AppRunner.prototype.stop = function(callback) {
  var self = this;

  if(!self.active) return;
  self.active = false;

  callback || (callback = function() {});

  self.appWrapper.stop(function(err) {
    if(err) return callback(err);

    console.log('server stopped');

    self.saasMock.unmock(function() {
      callback();
    });
  });
};




