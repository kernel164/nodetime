'use strict';

var OperationWrapper = require('../lib/operation-wrapper').OperationWrapper;
var ow = module.exports = new OperationWrapper();


ow.setLoader(function() {

  var Db = require('mongodb').Db;
  var Server = require('mongodb').Server;
  var client = new Db('test', new Server("127.0.0.1", 27017, {}), {safe:false});

  client.open(function(err) {
    ow.setExecutor(function(req, res, callback) {
      client.collection('test_col', function(err, collection) {
        if(err) return callback(err);
    
        collection.insert({test:123}, {safe: true}, function(err, docs) {
          if(err) return callback(err);

          collection.count({test:123}, function(err) {
            if(err) return callback(err);
  
            callback();
          });
        });
      });
    });

    ow.setCleaner(function(callback) {
      client.collection('test_col', function(err, collection) {
        if(err) return callback(err);
    
        collection.remove({}, function(err, docs) {
          if(err) return callback(err);
        });
      });
    });
  });
});
