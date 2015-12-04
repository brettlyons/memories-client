angular.module('memoriesApp', ['ngRoute'])
  .config(function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: '/partials/homePartial.html',
        controller: 'MemoriesController'
      })
      .when('/years/:year', {
        templateUrl: '/partials/yearPartial.html',
        controller: 'YearController'
      });
    $locationProvider.html5Mode(true);
  })
  .controller('MemoriesController', function($scope, $http, $rootScope) {
    $scope.showMemForm = false;
    $scope.getMemories = function (nextIndex) {
      if(!nextIndex) { nextIndex = 0; }
      $http.get('http://galvanize-service-registry.cfapps.io/api/v1/cohorts/g12/kids-these-days').then(function(response) {
        $rootScope.serviceUrl = 'http://g12-brett-lyons-memories.cfapps.io/api/v1/memories';
        // the consistency of paths / etc / stuff accross microservices arch is not so good atm.
        // console.log("URL: ", response.data.data[nextIndex].attributes.url);
        // $rootScope.serviceUrl = response.data.data[nextIndex].attributes.url + "/api/v1/memories";
        // console.log("ROOT SCOPE on first Fetch", $rootScope.serviceUrl);
        $http.get($rootScope.serviceUrl)
          .then(function successCallback(response) {
            $rootScope.memoryResponse = response.data.data;
          }, function errorCallback(response) {
            console.log('ERROR:', response);
            $scope.msg = 'ERR: ' + response;
            //console.log("TYPEOF getMemories", typeof $scope.getMemories)
            $scope.getMemories(nextIndex + 1);
          });
        // $http.get($rootScope.serviceUrl + "/years")
        $http.get('http://g12-brett-lyons-memories.cfapps.io/api/v1/memories/years')
          .then(function(response) {
            // console.log("Root Scope in get/years", $rootScope.serviceUrl);
            // console.log("Response.data.data", response.data.data);

            // if(!response.data.data) { $scope.getMemories(nextIndex + 1); }

            $scope.sidebarYears = response.data.data.reduce(function(collection, currentVal) {
              if (collection.indexOf(currentVal) < 0) {
                collection.push(currentVal);
              }
              return collection;
            }, []).sort(function(a, b) { return a - b;});
          });

      });
    }(); // <-- essential auto-invoke on page load

    $scope.toggleFormShow = function() {
      $scope.showMemForm = !$scope.showMemForm;
    };

    $scope.postToApi = function() {
      console.log("Root Scope at Post: ", $rootScope);
      $http.post($rootScope.serviceUrl, {
      // $http.post('http://g12-brett-lyons-memories.cfapps.io/api/v1/memories', {
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
  })
  .controller('YearController', function($scope, $http, $rootScope, $routeParams) {
    console.log("Root Scope in YearController:", $rootScope.serviceUrl)
    // $http.get($rootScope.serviceUrl + "/" + $routeParams.year)
    $http.get('http://g12-brett-lyons-memories.cfapps.io/api/v1/memories/' + $routeParams.year)
      .then(function successCallback(response) {
        console.log("Year Controller response.data.data", response.data.data);
        $rootScope.memoryResponse = response.data.data;
      }, function errorCallback(response) {
        console.log('ERROR:', response);
        $scope.msg = 'ERR: ' + response;
      });
  });

