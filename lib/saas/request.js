var http = require('http');
var https = require('https');
var url = require('url');
var zlib = require('zlib');


module.exports = function(opts, callback) {
  var parts = url.parse(opts.url);

  var requestOpts = {
    hostname: parts.hostname,
    port: parts.port,
    path: parts.path,
    method: opts.method,
    headers: opts.headers || {}
  };

  requestOpts.headers['Content-type'] = 'application/json';
  if(opts.json) {
    requestOpts.headers['Content-encoding'] = 'gzip';
  }

  var body = new Buffer(0);
  var req = (parts.protocol === 'http:' ? http : https).request(requestOpts, function(res) {
    res.on('data', function(chunk) {
      body = Buffer.concat([body, chunk]);
    });
    res.on('end', function() {
      if(res.headers['content-encoding'] === 'gzip') {
        zlib.gunzip(body, function(err, body) {
          if(err) return callback(err);

          callback(null, res, body.toString('utf8'));
        });
      }
      else {
        callback(null, res, body.toString('utf8'));
      }
    });
  });

  if(opts.timeout) {
    req.setTimeout(opts.timeout, function() {
      callback(new Error('request timeout'));
    });
  }

  req.on('error', function(err) {
    callback(err);
  });

  if(opts.json) {
    zlib.gzip(JSON.stringify(opts.json), function(err, compressed) {
      if(err) return callback(err);

      req.write(compressed);
      req.end();
    });
  }
  else {
    req.end();
  }

};

