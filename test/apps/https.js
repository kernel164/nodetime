
var AppWrapper = require('../lib/app-wrapper').AppWrapper;
var aw = module.exports = new AppWrapper();


aw.setLoader(function() {
  var https = require('https');
  var server = https.createServer(function(req, res) {
    aw.handleRequest(req, res, function(err) {
      if(err) console.log(err);

      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('Hello World\n');
    });
  });

  aw.setStarter(function(port, callback) {
    server.listen(port, function() {
      callback();
    });
  });

  aw.setStopper(function(callback) {
    server.close(function() {
      callback();
    });
  });
});



