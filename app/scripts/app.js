'use strict';

angular.module('app', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ngStorage',
  'ui.bootstrap',
  'pascalprecht.translate'
])
  .config(function ($routeProvider, $locationProvider, $translateProvider) {
    $routeProvider
      .when('/', {
        redirectTo: '/jobs'
      })
      .when('/settings', {
        templateUrl: 'partials/settings',
        controller: 'SettingsCtrl'
      })
      .when('/jobs/:viewName?', {
        templateUrl: 'partials/jobs',
        controller: 'JobsCtrl'
      })
      .when('/job/:jobName', {
        templateUrl: 'partials/job',
        controller: 'JobCtrl'
      })
      .when('/build/:jobName/:buildNumber', {
        templateUrl: 'partials/build',
        controller: 'BuildCtrl'
      })
      .when('/build/:jobName/:buildNumber/logs', {
        templateUrl: 'partials/logs',
        controller: 'LogsCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode(true);

    $translateProvider.useStaticFilesLoader({
      prefix: '/languages/',
      suffix: '.json'
    });
    $translateProvider.preferredLanguage(window.navigator.userLanguage || window.navigator.language);
  })
  .run(function ($rootScope, $location, $localStorage, $translate) {
    $rootScope.jenkinsBaseUrl = $localStorage.jenkinsBaseUrl || 'http://ci.myserver.com/';
    $rootScope.login = $localStorage.jenkinsLogin;
    $rootScope.password = $localStorage.jenkinsPassword;
    $rootScope.apiToken = $localStorage.apiToken;
    $rootScope.defaultView = $localStorage.defaultView || 'All';
    $rootScope.refreshFreq = $localStorage.refreshFreq || 10;

    $rootScope.alerts = [];

    $rootScope.encrypt = function (text) {
      try {
        return CryptoJS.AES.encrypt(text, $rootScope.cryptoKey).toString();
      } catch (err) {
        console.error(err);
        return null;
      }
    };

    $rootScope.decrypt = function (encryptedText) {
      try {
        return CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(encryptedText, $rootScope.cryptoKey));
      } catch (err) {
        console.error(err);
        return null;
      }
    };

    $rootScope.addAlert = function (alert, autoCloseDelay, callback) {
      $translate(alert.msg).then(function (msg) {
        var alertIndex;
        alert.msg = msg;
        $rootScope.alerts.push(alert);
        alertIndex = $rootScope.alerts.length - 1;
        if (autoCloseDelay) {
          (function (index) {
            window.setTimeout(function () {
              $rootScope.$apply(function () {
                $rootScope.closeAlert(index);
              });
            }, autoCloseDelay);
          })(alertIndex);
          if (callback) {
            callback(null, alertIndex);
          }
        }
      });
    };

    $rootScope.closeAlert = function (index) {
      if (typeof index !== 'number') {
        index = $rootScope.alerts.length - 1;
      }
      $rootScope.alerts.splice(index, 1);
    };

    $rootScope.errorHandler = function (data, status, headers, config) {
      console.error('error :', data);
      if (status === 401 || status === 403) {
        $rootScope.addAlert({
          type: 'danger',
          msg: data
        });
        if ($location.path() !== '/settings') {
          $localStorage.jenkinsLogin = null;
          $localStorage.jenkinsPassword = null;
          $location.path('/settings');
        }
      }
    };

    $rootScope.$on('$routeChangeStart', function (event, nextLoc, currentLoc) {
      if ($rootScope.pollingTimer) {
        window.clearInterval($rootScope.pollingTimer);
        $rootScope.pollingTimer = null;
      }
      if (!$rootScope.login && $location.path() !== '/settings') {
        $location.path('/settings');
      }
    });
  });
