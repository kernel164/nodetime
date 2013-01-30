'use strict';

function OperationWrapper() {
  this.loader = undefined;
  this.executor = undefined;
}
exports.OperationWrapper = OperationWrapper;



OperationWrapper.prototype.setLoader = function(loader) {
  this.loader = loader;
};


OperationWrapper.prototype.setExecutor = function(executor) {
  this.executor = executor;
};


OperationWrapper.prototype.setCleaner = function(cleaner) {
  this.cleaner = cleaner;
};


OperationWrapper.prototype.load = function() {
  this.loader()
};


OperationWrapper.prototype.execute = function(req, res, callback) {
  this.executor(req, res, callback)
};


OperationWrapper.prototype.clean = function(callback) {
  if(this.cleaner) this.cleaner(callback);
};
