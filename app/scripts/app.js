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
    $translateProvider.preferredLanguage('fr');
  })
  .run(function ($rootScope, $location, $localStorage, $translate) {
    $rootScope.jenkinsBaseUrl = $localStorage.jenkinsBaseUrl || 'http://ci.myserver.com/';
    $rootScope.refreshFreq = $localStorage.refreshFreq || 10;
    $rootScope.defaultView = $localStorage.defaultView;
    $rootScope.alerts = [];

    $rootScope.addAlert = function (alert, autoCloseDelay) {
      if (alert.msg) {
        $translate(alert.msg).then(function (msg) {
          alert.msg = msg;
          $rootScope.alerts.push(alert);
          if (autoCloseDelay) {
            (function (index) {
              window.setTimeout(function () {
                $rootScope.$apply(function () {
                  $rootScope.closeAlert(index);
                });
              }, autoCloseDelay);
            })($rootScope.alerts.length - 1);
          }

        });
      }
    };

    $rootScope.closeAlert = function (index) {
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
      $rootScope.login = $localStorage.jenkinsLogin;
      $rootScope.password = $localStorage.jenkinsPassword;
      if (!$rootScope.login && $location.path() !== '/settings') {
        $location.path('/settings');
      }
    });
  });
