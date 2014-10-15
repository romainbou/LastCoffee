'use strict';

Number.prototype.mod = function(n) {
    // -9 % 24 === -9 :( 
    // (-9).mod(24) === 15 :)
    return ((this%n)+n)%n; 
};

var lastCoffeeApp = angular.module('lastCoffeeApp', ['mgcrea.ngStrap']);

lastCoffeeApp.controller('CoffeeCtrl', ['$scope', '$http',
  function($scope, $http) {
    $scope.max = 9;
    $scope.nbCoffee = 2;
    $scope.lastCoffeeTime = 36000000;
    $scope.bedTime = 75600000;
    $scope.forbidden = false;
    $scope.changeNbCoffee = function(nb){
      $scope.nbCoffee = nb;
    }
    $scope.getNumber = function(num) {
      return new Array(num);
    }
    $scope.drinkCoffee = function(){
      $scope.nbCoffee ++;
      var d = new Date();
      var m = (Math.round(d.getMinutes()/15))/4;
      var h = d.getHours();
      $scope.lastCoffeeTime = (m+h-1)*3600000;
    }
    $scope.getStillWakeTime = function(){
      return ((($scope.bedTime / 3600000)+1) - (($scope.lastCoffeeTime / 3600000)+1)).mod(24);
    }
    $http.get('data/result.json').success(function(data) {
      $scope.results = data;
      $scope.getResult = function(){
        var stillWake = $scope.getStillWakeTime();
        if($scope.nbCoffee>7){
          $scope.forbidden = true;
          return $scope.results.toomany;
        }else if(stillWake<5){
          $scope.forbidden = true;
          return $scope.results.toolate;
        }else if($scope.nbCoffe>5 && $scope.nbCoffe<8 && stillWake>6){
          $scope.forbidden = true;
          return $scope.results.okayish;
        }else{
          $scope.forbidden = false;
          return $scope.results.ok;
        }
      }
    });
  }
]);