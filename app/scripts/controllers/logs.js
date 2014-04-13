'use strict';

angular.module('app')
  .controller('LogsCtrl', function ($scope, $rootScope, $location, $http, $localStorage, $routeParams) {
    $scope.jobName = $routeParams.jobName;
    $scope.buildNumber = $routeParams.buildNumber;

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
        + '/logText/progressiveText';
      $http(httpConfig)
        .success(function (data, status, header, config, statusText) {
          $scope.logs = data.substring(1, data.length - 1).replace(/\\r\\n/g, '\r');
          $scope.noRows = $scope.logs.split('\r').length + 1;
        })
        .error($rootScope.errorHandler);
    }

    loadJobBuildInfos($routeParams.jobName, $routeParams.buildNumber);

  });
