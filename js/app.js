angular.module('memoriesApp', [])
  .controller("MemoriesController", function($scope, $http) {
    $scope.getMemories = function () {
    return $http({
      method: 'GET',
      url: 'http://g12-brett-lyons-memories.cfapps.io/api/v1/memories'
    }).then(function successCallback(response) {
      response.data.data.forEach(function(dataPoint) {
        // console.log("SUCCESS", response.data.data);
      })
      $scope.memoryResponse = response.data.data;
      }, function errorCallback(response) {
        console.log("ERROR:", response);
        $scope.msg = "ERR: " + response;
      });
    }();
  });
