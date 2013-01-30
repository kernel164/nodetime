'use strict';

var async = require('async');


function AppWrapper() {
  this.loader = undefined;
  this.starter = undefined;
  this.stopper = undefined;
  this.operationWrappers = [];
  this.executionType = 'parallel';
}
exports.AppWrapper = AppWrapper;



AppWrapper.prototype.setLoader = function(loader) {
  this.loader = loader;
};


AppWrapper.prototype.setStarter = function(starter) {
  this.starter = starter;
};


AppWrapper.prototype.setStopper = function(stopper) {
  this.stopper = stopper;
};


AppWrapper.prototype.addOperationWrapper = function(operationWrapper) {
  this.operationWrappers.push(operationWrapper);
}


AppWrapper.prototype.setExecutionType = function(executionType) {
  this.executionType = executionType;
};


AppWrapper.prototype.load = function() {
  this.loader();
};


AppWrapper.prototype.start = function(port, callback) {
  this.starter(port, callback);
};


AppWrapper.prototype.stop = function(callback) {
  this.operationWrappers.forEach(function(operationWrapper) {
    operationWrapper.clean(function(err) {
      if(err) console.log(err);
    });
  });

  this.stopper(callback);
};


AppWrapper.prototype.handleRequest = function(req, res, callback) {
  var self = this;

  var funcs = [];

  self.operationWrappers.forEach(function(operationWrapper) {
    funcs.push(function(callback) {
      operationWrapper.execute(req, res, function(err) {
        if(err) console.log(err);
        
        callback();
      });
    });
  });

  if(self.executionType === 'parallel') {
    async.parallel(funcs, function(err, result) {
      if(err) return callback(err);

      callback();
    });
  }
  else if(self.executionType === 'series') {
    async.series(funcs, function(err, result) {
      if(err) return callback(err);

      callback();
    });
  }
};