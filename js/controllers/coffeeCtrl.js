'use strict';

Number.prototype.mod = function(n) {
    // -9 % 24 === -9 :( 
    // (-9).mod(24) === 15 :)
    return ((this%n)+n)%n; 
};

var lastCoffeeApp = angular.module('lastCoffeeApp', ['LocalStorageModule', 'mgcrea.ngStrap']);

lastCoffeeApp.config(function (localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix('lastCoffeeApp');
});

lastCoffeeApp.controller('CoffeeCtrl', ['$scope', '$http', 'localStorageService',
  function($scope, $http, $ls) {
    $scope.max = 9;
    $scope.state = "ok";
    $scope.minuteStep = 15;
    
    //sync values with the LocalStorage
    $ls.bind($scope, 'lastCoffeeTime');
    $ls.bind($scope, 'bedTime');
    $ls.bind($scope, 'nbCoffee');
    
    var getCurrentTime = function(){
      var d = new Date();
      var m = (Math.round(d.getMinutes()/$scope.minuteStep))/(60/$scope.minuteStep);
      var h = d.getHours();
      return (m+h-1)*3600000;
    }

    //initialize with past values if exist or default values
    $scope.nbCoffee = $ls.get('nbCoffee') ||  0;
    $scope.lastCoffeeTime = $ls.get('lastCoffeeTime') ||  getCurrentTime();
    $scope.bedTime = $ls.get('bedTime') || 75600000;
    
    $scope.changeNbCoffee = function(nb){
      $scope.nbCoffee = nb;
    }
    $scope.getNumber = function(num) {
      return new Array(num);
    }
    $scope.drinkCoffee = function(){
      $scope.nbCoffee ++;
      $scope.lastCoffeeTime = getCurrentTime();
    }
    var getStillAwakeTime = function(){
      return ((($scope.bedTime / 3600000)+1) - (($scope.lastCoffeeTime / 3600000)+1)).mod(24);
    }
    $http.get('data/result.json').success(function(data) {
      $scope.results = data;
      $scope.getResult = function(){
        var stillAwakeTime =  getStillAwakeTime();
        var match = false, i = 0, size = data.length;
        var result, conditionCoffee, conditionSleep;
        while(i<size && !match){
          result = data[i];
          conditionCoffee = result.conditionCoffee; 
          conditionSleep = result.conditionSleep;
          //conditionCoffee == [{"val":7, "ie" : "excl"}, null] => test if($scope.nbCoffee ∈  ]7,+∞[ )
          //conditionCoffee == [null, {"val":7, "ie" : "incl"}] => test if($scope.nbCoffee ∈  ]-∞,7] )
          if((conditionCoffee[0] === null || (conditionCoffee[0].ie === "incl" && $scope.nbCoffee >= conditionCoffee[0].val) || (conditionCoffee[0].ie === "excl" && $scope.nbCoffee > conditionCoffee[0].val))
            &&(conditionCoffee[1] === null || (conditionCoffee[1].ie === "incl" && $scope.nbCoffee <= conditionCoffee[1].val) || (conditionCoffee[1].ie === "excl" && $scope.nbCoffee < conditionCoffee[1].val))
            &&(conditionSleep[0] === null || (conditionSleep[0].ie === "incl" && stillAwakeTime >= conditionSleep[0].val) || (conditionSleep[0].ie === "excl" && stillAwakeTime > conditionSleep[0].val))
            &&(conditionSleep[1] === null || (conditionSleep[1].ie === "incl" && stillAwakeTime <= conditionSleep[1].val) || (conditionSleep[1].ie === "excl" && stillAwakeTime < conditionSleep[1].val))){
              match = true;
          }
          i++;
        }
        $scope.state = result.state;
        return result;
      }
    });
  }
]);