
'use strict';

var os = require('os');

function toTargetIp(ip) {
  var ifaces = os.networkInterfaces();
  var addresses = [];
  var split;

  if (process.env.DOCKER_HOST) {
    split = /tcp:\/\/([0-9.]+):([0-9]+)/g.exec(process.env.DOCKER_HOST);

    if (split && (!ip || ip !== split[1])) {
      ip = split[1];
    }
  }

  if (ip) {
    return ip;
  }

  function addIfExternal(acc, details) {
    if (details.family === 'IPv4' && !details.internal) {
      acc.push(details.address);
    }
    return acc;
  }

  Object.keys(ifaces).forEach(function(dev) {
    ifaces[dev].reduce(addIfExternal, addresses);
  });

  return addresses[0] || '127.0.0.1';
}

module.exports = toTargetIp;

if (require.main === module) {
  console.log(toTargetIp(process.argv[2]));
}
