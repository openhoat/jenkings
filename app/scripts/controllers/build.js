'use strict';

angular.module('app')
  .controller('BuildCtrl', function ($scope, $rootScope, $location, $http, $localStorage, $routeParams) {
    $scope.jobName = $routeParams.jobName;

    function loadJobBuildInfos(jobName, buildNumber) {
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
        + '/job/' + jobName + '/' + buildNumber
        + '/api/json';
      $rootScope.addAlert({ msg: 'Loading...', type: 'warning' });
      $http(httpConfig)
        .success(function (data, status, header, config, statusText) {
          $rootScope.closeAlert();
          $scope.build = data;
        })
        .error($rootScope.errorHandler);
    }

    loadJobBuildInfos($routeParams.jobName, $routeParams.buildNumber);

  });
