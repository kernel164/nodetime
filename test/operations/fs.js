'use strict';

var OperationWrapper = require('../lib/operation-wrapper').OperationWrapper;
var ow = module.exports = new OperationWrapper();


ow.setLoader(function() {
  var fs = require('fs');

  ow.setExecutor(function(req, res, callback) {
    fs.mkdirSync('/tmp/fstest');

    fs.rmdirSync('/tmp/fstest');

    fs.mkdir('/tmp/fstest', function(err) {
      if(err) console.error(err);

      fs.rmdir('/tmp/fstest', function(err) {
        if(err) return callback(err);

        callback();
      });
    });
  });

  ow.setCleaner(function(callback) {
  });
});
