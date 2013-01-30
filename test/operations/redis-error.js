'use strict';

var OperationWrapper = require('../lib/operation-wrapper').OperationWrapper;
var ow = module.exports = new OperationWrapper();


ow.setLoader(function() {
  var redis = require('redis');
  var client = redis.createClient();

  ow.setExecutor(function(req, res, callback) {
    client.set(1, function(err) {
      callback(err);
    });
  });
});
