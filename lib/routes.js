'use strict';

var index = require('./controllers')
  , apiJenkins = require('./controllers/api/jenkins');

/**
 * Application routes
 */
module.exports = function (app) {

  // Server API Routes
  app.get('/api/jenkins', apiJenkins.get);
  app.post('/api/jenkins', apiJenkins.post);

  // All undefined api routes should return a 404
  app.get('/api/*', function (req, res) {
    res.send(404);
  });

  // All other routes to use Angular routing in app/scripts/app.js
  app.get('/partials/*', index.partials);
  app.get('/*', index.index);
};