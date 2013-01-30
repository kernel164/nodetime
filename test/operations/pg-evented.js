'use strict';

var OperationWrapper = require('../lib/operation-wrapper').OperationWrapper;
var ow = module.exports = new OperationWrapper();


ow.setLoader(function() {
  var pg = require('pg').native;

  var client = new pg.Client("tcp://postgres:postgres@localhost/postgres");

  ow.setExecutor(function(req, res, callback) {
    client.connect();
  
    var query = client.query('create temporary table test_table (str_field varchar(10), int_field integer, date_field timestamptz)');

    query.on('row', function(row) {
    });

    query.on('error', function(err) {
    });

    query.on('end', function() {
    });


    var query = client.query('errorgeneratingcommand');

    query.on('row', function(row) {
    });

    query.on('error', function(err) {
    });

    query.on('end', function() {
      callback();
    });
  });

  ow.setCleaner(function(callback) {

  });
});
