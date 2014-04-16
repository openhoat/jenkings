'use strict';

angular.module('app')
  .controller('SettingsCtrl', function ($rootScope, $scope, $location, $localStorage) {
    $scope.password = $rootScope.decrypt($localStorage.jenkinsPassword);

    $scope.save = function () {
      $rootScope.password = $rootScope.encrypt($scope.password);
      if ($rootScope.jenkinsBaseUrl.substring($rootScope.jenkinsBaseUrl.length - 1) === '/') {
        $rootScope.jenkinsBaseUrl = $rootScope.jenkinsBaseUrl.substring(0, $rootScope.jenkinsBaseUrl.length - 1);
      }
      $localStorage.jenkinsBaseUrl = $rootScope.jenkinsBaseUrl;
      $localStorage.jenkinsLogin = $rootScope.login;
      $localStorage.jenkinsPassword = $rootScope.password;
      $localStorage.apiToken = $rootScope.apiToken;
      $localStorage.defaultView = $rootScope.defaultView;
      $localStorage.refreshFreq = $rootScope.refreshFreq;
      $rootScope.menu = null;
      $location.path('/');
    };
  });
