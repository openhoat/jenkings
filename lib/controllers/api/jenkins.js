'use strict';

var request = require('request')
  , CryptoJS = require('node-cryptojs-aes').CryptoJS
  , config = require('../../config/config');

function checkLogin(options, login, encryptedPassword) {
  var decrypted;
  if (login) {
    options.auth = {
      user: login
    };
    if (encryptedPassword) {
      try {
        decrypted = CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(encryptedPassword, config.cryptoKey));
      } catch (err) {
        console.error(err);
      }
      options.auth.pass = decrypted;
    }
  }
}

exports.get = function (req, res) {
  var options;
  options = {
    method: 'GET',
    uri: req.query.jenkinsApiUrl,
    json: true
  };
  checkLogin(options, req.query.jenkinsLogin, req.query.jenkinsPassword);
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
  checkLogin(options, req.query.jenkinsLogin, req.query.jenkinsPassword);
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