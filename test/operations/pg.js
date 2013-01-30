'use strict';

var OperationWrapper = require('../lib/operation-wrapper').OperationWrapper;
var ow = module.exports = new OperationWrapper();


ow.setLoader(function() {
  var pg = require('pg');

  pg.connect("tcp://postgres:postgres@localhost/postgres", function(err, client) {
    if(err) return callback();
  
    ow.setExecutor(function(req, res, callback) {

      client.query('create database test_db', function(err) {
        if(err) return callback();

        client.query('create temporary table test_table (str_field varchar(10), int_field integer, date_field timestamptz)', function(err) {
          if(err) return callback();
    
          client.query('insert into test_table (str_field, int_field, date_field) values ($1, $2, $3)', ['data', 123, new Date()], function(err) {
            if(err) return callback();

            client.query('select * from test_table', function(err) {
              if(err) return callback();
    
              callback();
            });
          });
        });
      });
    });
  
    ow.setCleaner(function(callback) {
      client.query('drop database test_db', function(err) {
        //client.close();
        callback();
      });
    });
  });
});
