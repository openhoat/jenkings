'use strict';

module.exports = {
  env: 'production',
  server: {
    socket: process.env['NODE_SOCKET_PATH']
  }
};