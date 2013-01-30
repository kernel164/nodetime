'use strict';

var OperationWrapper = require('../lib/operation-wrapper').OperationWrapper;
var ow = module.exports = new OperationWrapper();


ow.setLoader(function() {
  var memcache = require('memcache');
  var client = new memcache.Client();
  client.connect();

  client.on('error', function(err) {
    callback(err);
  });

  client.on('timeout', function(err) {
    callback(err);
  });

  client.on('connect', function() {
    ow.setExecutor(function(req, res, callback) {
      client.add('testkey','testval', function(err, result){
        if(err) return callback(err);

        client.get('testkey', function(err, result) {
          if(err) return callback(err);

          callback();
        });
      });
    });
    ow.setCleaner(function(callback) {
    });
  });
});
