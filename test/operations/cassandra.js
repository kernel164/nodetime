'use strict';

var OperationWrapper = require('../lib/operation-wrapper').OperationWrapper;
var ow = module.exports = new OperationWrapper();


ow.setLoader(function() {

  ow.setExecutor(function(req, res, callback) {

  });

  ow.setCleaner(function(callback) {

  });
});
