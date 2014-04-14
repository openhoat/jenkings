'use strict';

angular.module('app')
  .controller('LoginCtrl', function ($rootScope, $scope, $location, $localStorage) {
    $scope.save = function () {
      $localStorage.jenkinsLogin = $rootScope.login;
      $localStorage.jenkinsPassword = $rootScope.password;
      $rootScope.menu = null;
      $location.path('/');
    };
  });
