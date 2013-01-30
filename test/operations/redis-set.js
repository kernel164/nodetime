'use strict';

var OperationWrapper = require('../lib/operation-wrapper').OperationWrapper;
var ow = module.exports = new OperationWrapper();


ow.setLoader(function() {
  var redis = require('redis');
  var client = redis.createClient();

  ow.setExecutor(function(req, res, callback) {
    client.set("key1", 1, function(err) {
      callback(err);
    });
  });

  ow.setCleaner(function(callback) {
    client.del("key1", function(err) {
      callback(err);
    });
  });
});
