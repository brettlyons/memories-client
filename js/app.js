angular.module('memoriesApp', [])
  .controller('MemoriesController', function($scope, $http) {
    $scope.showMemForm = false;
    $scope.getMemories = function() {
    $http({
      method: 'GET',
      url: 'http://g12-brett-lyons-memories.cfapps.io/api/v1/memories'
    }).then(function successCallback(response) {
      // console.log('RESPONSE', response, 'RESPONSE.DATA', response.data)
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

      console.log($scope.old_days, $scope.these_days, $scope.year);
      const tmpObj = {
        'data': {
            'type': 'memory',
            'attributes': {
              'old_days': $scope.old_days,
              'these_days': $scope.these_days,
              'year': $scope.year
            }
          }
      };
      $http.post('http://g12-brett-lyons-memories.cfapps.io/api/v1/memories',
                 tmpObj).then(function() {}); // just in case its needed later
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
});

