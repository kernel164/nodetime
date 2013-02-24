
var os = require('os');
var childProcess = require('child_process');

var headerRegex = /^(Filesystem)\s+(\w+\-blocks)\s+(Used)\s+(Available)\s+/;
var mountRegex = /^\/dev\/([^\s]+)\s+(\d+)\s+(\d+)\s+(\d+)\s+/;

childProcess.exec('df -k', function(err, stdout, stderr) {
  try {
    if(err) return console.error(err);

    var lines = stdout.split('\n');
    if(lines.length == 0) return;

    if(!headerRegex.exec(lines[0])) return;

    for(var i = 1; i < lines.length; i++) {
      var mount = {};

      var mountMatch = mountRegex.exec(lines[i]);
      if(mountMatch && mountMatch.length == 5) {
        mount.device = mountMatch[1];
        mount.used = parseInt(mountMatch[3]) / 1024;
        mount.available = parseInt(mountMatch[4]) / 1024;
      }

      if(mount.device && mount.used !== undefined && mount.available !== undefined) {
        var total = mount.used + mount.available;

        console.log(mount);
      }
    }
  }
  catch(err) {
    console.error(err);
  }
});