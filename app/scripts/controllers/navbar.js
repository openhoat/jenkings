'use strict';

angular.module('app')
  .controller('NavbarCtrl', function ($scope, $location, $rootScope, $http) {
    $scope.isActive = function (route) {
      return route === $location.path();
    };

    function buildViewsMenu(views) {
      var args;
      if (views && views.length) {
        args = [ 0, 0 ];
        views.forEach(function (view) {
          args.push({
            title: view.name,
            link: '/jobs/' + view.name
          });
        });
        Array.prototype.splice.apply($rootScope.menu, args);
      }
    }

    function loadJenkinsData() {
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
        + '/api/json';
      $http(httpConfig)
        .success(function (jenkinsData) {
          buildViewsMenu(jenkinsData.views);
        })
        .error($rootScope.errorHandler);
    }

    if (!$rootScope.menu) {
      $rootScope.menu = [
        {
          'title': 'Settings',
          'link': '/settings'
        }
      ];
      loadJenkinsData();
    }
  });
