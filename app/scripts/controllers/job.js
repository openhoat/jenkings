'use strict';

angular.module('app')
  .controller('JobCtrl', function ($scope, $rootScope, $location, $http, $localStorage, $routeParams) {

    function loadJenkinsJobDetails(jobName) {
      var httpConfig;
      httpConfig = {
        method: 'GET',
        url: '/api/jenkins',
        params: {
          jenkinsLogin: $rootScope.login,
          jenkinsPassword: $rootScope.password
        }
      };
      httpConfig.params.jenkinsApiUrl = $rootScope.jenkinsBaseUrl
        + '/job/' + jobName
        + '/api/json';
      $http(httpConfig)
        .success(function (data, status, header, config, statusText) {
          $scope.job = data;
        })
        .error($rootScope.errorHandler);
    }

    loadJenkinsJobDetails($routeParams.jobName);
  });
