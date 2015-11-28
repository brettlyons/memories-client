angular.module('memoriesApp', ['ngRoute'])
  .config(function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: '/partials/homePartial.html',
        controller: 'MemoriesController'
      })
      .when('/:year', {
        templateUrl: '/partials/yearPartial.html',
        controller: 'YearController'
      })
    $locationProvider.html5Mode(true);
  })
  .controller('MemoriesController', function($scope, $http, $rootScope) {
    $scope.showMemForm = false;
    $scope.getMemories = function() {
      $http.get('http://galvanize-service-registry.cfapps.io/api/v1/cohorts/g12/kids-these-days').then(function(response) {
        $rootScope.serviceUrl = response.data[0].attributes.url + "/api/v1/memories";
        $http.get($rootScope.serviceUrl);
          .then(function successCallback(response) {
            $scope.memoryResponse = response.data.data;
          }, function errorCallback(response) {
            console.log('ERROR:', response);
            $scope.msg = 'ERR: ' + response;
            $scope.getMemories();
          });
      })
    }(); // <-- essential auto-invoke on page load

    $scope.toggleFormShow = function() {
      $scope.showMemForm = !$scope.showMemForm;
    };

    $scope.postToApi = function() {
      // $http.post($rootScope.serviceUrl, {
      $http.post('http://g12-brett-lyons-memories.cfapps.io/api/v1/memories', {
        'data': {
          'type': 'memory',
          'attributes': {
            'old_days': $scope.old_days,
            'these_days': $scope.these_days,
            'year': $scope.year
          }
        }
      }).then(function() {}); // just in case its needed later
    };
    // $http.get($rootScope.serviceUrl + "/years")
    $http.get('http://g12-brett-lyons-memories.cfapps.io/api/v1/memories/years')
      .then(function(response) {
        $scope.sidebarYears = response.data.data.reduce(function(collection, currentVal) {
          if (collection.indexOf(currentVal) < 0) {
            collection.push(currentVal);
          }
          return collection;
        }, []).sort(function(a,  b) { return a - b;});
      });
  })
  .controller('YearController', function($scope, $http, $rootScope, $routeParams) {
    // $http.get($rootScope.serviceUrl + "/" + $routeParams.year)
    $http.get('http://g12-brett-lyons-memories.cfapps.io/api/v1/memories/' + $routeParams.year)
      .then(function successCallback(response) {
        $scope.memoryResponse = response.data.data;
      }, function errorCallback(response) {
        console.log('ERROR:', response);
        $scope.msg = 'ERR: ' + response;
      });
  });

