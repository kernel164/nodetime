'use strict';

var OperationWrapper = require('../lib/operation-wrapper').OperationWrapper;
var ow = module.exports = new OperationWrapper();


ow.setLoader(function() {
  var http = require('http');
  var https = require('https');

  ow.setExecutor(function(req, res, callback) {
    function error() {
      var client = http.get({hostname: 'nonexisting'}, function(cRes) {
        cRes.on('end', function() { 
          success();
        });

        cRes.on('error', function(err) {
          success();
        });
      });

      client.on('error', function(err) {
        success();
      });
    };


    function success() {
      var client = http.get({hostname: 'nodetime.com'}, function(cRes) {
        cRes.on('end', function() { 
          callback();
        });

        cRes.on('error', function(err) {
          callback();
        });
      });

      client.on('error', function(err) {
        callback();
      });
    };

    error();
  });

  ow.setCleaner(function(callback) {

  });
});
