'use strict';

var OperationWrapper = require('../lib/operation-wrapper').OperationWrapper;
var ow = module.exports = new OperationWrapper();


ow.setLoader(function() {
  var redis = require('redis');
  var client = redis.createClient();

  ow.setExecutor(function(req, res, callback) {
    client.mget(
      'first', 
      'second', 
      'third', 
      '4', 
      5, 
      undefined, 
      null, 
      'verylongverylongverylongverylongverylongverylongverylongverylongverylong',
      9, 
      10, 
      12, 
      function(err) 
    {
      if(err) return callback(err);

      client.keys(function(err, keys) {
        //if(err) return callback(err); // expected error
    
        callback();
      });
    });
  });

  ow.setCleaner(function(callback) {

  });
});
