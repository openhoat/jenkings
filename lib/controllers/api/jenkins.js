'use strict';

var request = require('request');

exports.get = function (req, res) {
  var options;
  options = {
    method: 'GET',
    uri: req.query.jenkinsApiUrl,
    json: true
  };
  if (req.query.jenkinsLogin) {
    options.auth = {
      user: req.query.jenkinsLogin,
      pass: req.query.jenkinsPassword
    };
  }
  request(options, function (error, response, result) {
    if (error) {
      console.error(error);
      res.send(500);
      return;
    }
    if (response.statusCode !== 200) {
      res.send(response.statusCode);
      return;
    }
    res.status(response.statusCode);
    res.json(result);
  });
};

exports.post = function (req, res) {
  var options;
  options = {
    method: 'POST',
    uri: req.query.jenkinsApiUrl,
    qs: {
      token: req.query.token
    },
    json: true
  };
  if (req.query.jenkinsLogin) {
    options.auth = {
      user: req.query.jenkinsLogin,
      pass: req.query.jenkinsPassword
    };
  }
  request(options, function (error, response, result) {
    if (error) {
      console.error(error);
      res.send(500);
      return;
    }
    if (response.statusCode !== 200) {
      res.send(response.statusCode);
      return;
    }
    res.status(response.statusCode);
    res.json(result);
  });
};