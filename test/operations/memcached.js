'use strict';

var OperationWrapper = require('../lib/operation-wrapper').OperationWrapper;
var ow = module.exports = new OperationWrapper();


ow.setLoader(function() {
  var Memcached = require('memcached');
  var memcached = new Memcached("127.0.0.1:11211");

  ow.setExecutor(function(req, res, callback) {
    memcached.set('testkey', 'testvalue', 1000, function(err, result) {
      if(err) return callback(err);

      memcached.get('testkey', function(err, result) {
        if(err) return callback(err);

        memcached.del('testkey', function(err, result) {
          if(err) return callback(err);

          callback();
        });
      });
    });
  });

  ow.setCleaner(function(callback) {

  });
});
