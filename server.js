'use strict';

var http = require('http')
  , fs = require('fs')
  , express = require('express')
  , config, app, httpServer;

/**
 * Main application file
 */

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Application Config
config = require('./lib/config/config');

app = express();

// Express settings
require('./lib/config/express')(app);

// Routing
require('./lib/routes')(app);

// Start server
httpServer = http.createServer(app);

if (config.server.socket) {
  fs.unlinkSync(config.server.socket);
  httpServer.listen(config.server.socket, function () {
    console.log('Http server listening on socket %s in %s mode', config.server.socket, app.get('env'));
    fs.chmodSync(config.server.socket, '660');
  });
} else {
  if (config.server.hostname) {
    httpServer.listen(config.server.port, config.server.hostname, function () {
      console.log('Http server listening on %s port %d in %s mode', config.server.hostname, config.server.port, app.get('env'));
    });
  } else {
    httpServer.listen(config.server.port, function () {
      console.log('Http server listening on port %d in %s mode', config.server.port, app.get('env'));
    });
  }
}

// Expose app
exports = module.exports = app;