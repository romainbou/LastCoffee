'use strict';

Number.prototype.mod = function(n) {
    // -9 % 24 === -9 :( 
    // (-9).mod(24) === 15 :)
    return ((this%n)+n)%n; 
};
var CustomTime = function(h, m) {
  this.h = h;
  this.m = m;
  this.getTime = function() {
    return parseInt(this.h) + parseFloat(this.m);
  };
}; 

var lastCoffeeApp = angular.module('lastCoffeeApp', []);
lastCoffeeApp.controller('CoffeeCtrl', ['$scope', '$http',
  function($scope, $http) {
    $scope.max = 9;
    $scope.nbCoffee = 0;
    $scope.lastCoffeeTime = new CustomTime('0','0');
    $scope.bedTime = new CustomTime('0','0');
    $scope.getNumber = function(num) {
        return new Array(num);   
    }
    $scope.getStillWakeTime = function(){
      return ($scope.bedTime.getTime() - $scope.lastCoffeeTime.getTime()).mod(24);
    }
    $http.get('data/result.json').success(function(data) {
      $scope.results = data;
      $scope.getResult = function(){
        var stillWake = $scope.getStillWakeTime();
        if($scope.nbCoffee>7)
          return $scope.results.toomany;
        if(stillWake<5)
          return $scope.results.toolate;
        if($scope.nbCoffe>5 && $scope.nbCoffe<8 && stillWake>6)
          return $scope.results.okayish;
        return $scope.results.ok;
      }
    });
  }
]);