'use strict';

var OperationWrapper = require('../lib/operation-wrapper').OperationWrapper;
var ow = module.exports = new OperationWrapper();


ow.setLoader(function() {
  var redis = require('redis');
  var client = redis.createClient();

  var data = '';
  for (var i = 0; i < 10000; i++) {
    data += '1';
  }


  ow.setExecutor(function(req, res, callback) {
    client.zadd("zset1", Date.now(), data, function(err) {
      callback(err);
    });
  });


  ow.setCleaner(function(callback) {
    client.del("zset1", function(err) {
      callback(err);
    });
  });

});
