'use strict';

var OperationWrapper = require('../lib/operation-wrapper').OperationWrapper;
var ow = module.exports = new OperationWrapper();


ow.setLoader(function() {
  var mysql = require('mysql');

  var client = mysql.createConnection({
    user: 'root',
    password: ''
  });

  ow.setExecutor(function(req, res, callback) {
    client.query('create database if not exists test_db2', function(err) {
      if(err) return callback(err);

      client.query('use test_db2', function(err) {
        client.query('create temporary table test_table (id int(11) auto_increment, test_field text, created datetime, primary key(id))', function(err) {
          if(err) return callback(err);
    
          client.query('insert into test_table set test_field=?, created=?', ['data', '2012-03-25 10:00:00'], function(err) {
            if(err) return callback(err);

            client.query('select * from test_table', function(err) {
              if(err) return callback(err);
    
              callback();
            });
          });
        });
      });
    });
  });

  ow.setCleaner(function(callback) {
    client.query('drop database test_db2', function(err) {
      callback(err);
    });
  });
});
