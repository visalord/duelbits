'use strict';

angular.module('duelbitsApp')
  .controller('HistoryCtrl', function ($scope, $window, $http) {
	if ($window.document.width < 700) {
		console.log('isMobile');
		$scope.isMobile = true;
	}else {
		console.log('isNotMobile');
		$scope.isMobile = false;
	}

	$http({
		method: 'GET',
		url: '/results/recent'
	}).success(function(data) {
		console.log('Recent matches recieved!');
		$scope.results = data;
		console.log(data);

	}).error(function() {
		console.log('could not get recent matches');
	});

});
