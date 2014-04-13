'use strict';

angular.module('app')
  .controller('JobsCtrl', function ($scope, $rootScope, $location, $http, $localStorage, $routeParams) {

    function buildJobStyles() {
      $scope.jobStyles = [];
      $scope.jobs.forEach(function (job) {
        var jobStyle = {};
        switch (job.color) {
          case 'blue':
            jobStyle.state = 'ok';
            jobStyle.stateClass = 'success';
            jobStyle.stateTitle = 'success';
            break;
          case 'blue_anime':
            jobStyle.state = 'ok';
            jobStyle.stateClass = 'success building';
            jobStyle.stateTitle = 'building';
            break;
          case 'yellow':
            jobStyle.state = 'failed';
            jobStyle.stateClass = 'warning';
            jobStyle.stateTitle = 'failed';
            break;
          case 'yellow_anime':
            jobStyle.state = 'failed';
            jobStyle.stateClass = 'warning building';
            jobStyle.stateTitle = 'building';
            break;
          case 'red':
            jobStyle.state = 'ko';
            jobStyle.stateClass = 'danger';
            jobStyle.stateTitle = 'error';
            break;
          case 'red_anime':
            jobStyle.state = 'ko';
            jobStyle.stateClass = 'danger building';
            jobStyle.stateTitle = 'building';
            break;
          case 'disabled':
            jobStyle.state = 'disabled';
            jobStyle.stateTitle = 'disabled';
            break;
          case 'disabled_anime':
            jobStyle.state = 'disabled';
            jobStyle.stateClass = 'building';
            jobStyle.stateTitle = 'building';
            break;
          case 'aborted':
            jobStyle.state = 'canceled';
            jobStyle.stateTitle = 'canceled';
            break;
          case 'aborted_anime':
            jobStyle.state = 'canceled';
            jobStyle.stateClass = 'building';
            jobStyle.stateTitle = 'building';
            break;
          case 'nobuilt':
            jobStyle.state = 'not built';
            jobStyle.stateTitle = 'not built';
            break;
          case 'nobuilt_anime':
            jobStyle.state = 'not built';
            jobStyle.stateClass = 'building';
            jobStyle.stateTitle = 'building';
            break;
        }
        $scope.jobStyles.push(jobStyle);
      });
    }

    function loadJenkinsJobs(withChangeAlert) {
      var httpConfig;
      if (typeof withChangeAlert === 'undefined') {
        withChangeAlert = true;
      }
      httpConfig = {
        method: 'GET',
        url: '/api/jenkins',
        params: {
          jenkinsLogin: $rootScope.login,
          jenkinsPassword: $rootScope.password
        }
      };
      httpConfig.params.jenkinsApiUrl = $rootScope.jenkinsBaseUrl
        + ($scope.viewName ? '/view/' + $scope.viewName : '')
        + '/api/json';
      $http(httpConfig)
        .success(function (data, status, header, config, statusText) {
          if (!angular.equals(data.jobs, $scope.jobs)) {
            if (withChangeAlert) {
              $rootScope.addAlert({
                type: 'success',
                msg: 'Informations updated'
              }, 2000);
            }
          }
          $scope.jobs = data.jobs;
          buildJobStyles();
        })
        .error($rootScope.errorHandler);
    }

    $scope.run = function (job) {
      var httpConfig;
      httpConfig = {
        method: 'POST',
        url: '/api/jenkins',
        params: {
          jenkinsLogin: $rootScope.login,
          jenkinsPassword: $rootScope.password,
          token: $rootScope.apiToken
        }
      };
      httpConfig.params.jenkinsApiUrl = $rootScope.jenkinsBaseUrl
        + '/job/' + job.name + '/build';
      $http(httpConfig)
        .success(function (data, status, header, config, statusText) {
          if (status === 201) {
            $rootScope.addAlert({
              type: 'info',
              msg: 'Build request registered'
            }, 2000);
          }
        })
        .error($rootScope.errorHandler);
    };

    $scope.jobStateClass = function (job) {
      var stateClass;
      switch (job.color) {
      }
      return stateClass;
    };

    if (!$routeParams.viewName) {
      $location.path('/jobs/' + $rootScope.defaultView);
      return;
    }
    $scope.viewName = $routeParams.viewName;

    $rootScope.pollingTimer = window.setInterval(loadJenkinsJobs, $rootScope.refreshFreq * 1000);
    loadJenkinsJobs(false);
  });
