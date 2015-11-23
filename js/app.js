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
  .controller('MemoriesController', function($scope, $http) {
    $scope.showMemForm = false;
    $scope.getMemories = function() {
      // This is the critical code to add when it comes time to do integration with the service discovery
      // it might need some other tuning
      // $http.get('http://galvanize-service-registry.cfapps.io/api/v1/cohorts/g12/kids-these-days').then(function(response) {
      //   $rootScope[url] = response.
      // })
      $http.get('http://g12-brett-lyons-memories.cfapps.io/api/v1/memories')
        .then(function successCallback(response) {
        $scope.memoryResponse = response.data.data;
      }, function errorCallback(response) {
        console.log('ERROR:', response);
        $scope.msg = 'ERR: ' + response;
      });
    }(); // <-- essential auto-invoke on page load

    $scope.toggleFormShow = function() {
      $scope.showMemForm = !$scope.showMemForm;
    };

    $scope.postToApi = function() {
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
  .controller('YearController', function($scope, $http, $routeParams) {
    $http.get('http://g12-brett-lyons-memories.cfapps.io/api/v1/memories/' + $routeParams.year)
      .then(function successCallback(response) {
        $scope.memoryResponse = response.data.data;
      }, function errorCallback(response) {
        console.log('ERROR:', response);
        $scope.msg = 'ERR: ' + response;
      });
  });

