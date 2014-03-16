'use strict';

angular.module('duelbitsApp')
  .controller('HistoryCtrl', function ($scope, $window, $http) {
	$http.get('/api/awesomeThings').success(function(awesomeThings) {
		$scope.awesomeThings = awesomeThings;
	});
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
		for (var i = 0; i < data.length; i++){
			data[i].yourTroops = Math.round((data[i].yourTroops * 0.9) * 1000) / 1000;
			data[i].oppTroops = Math.round((data[i].oppTroops * 0.9) * 1000) / 1000;
			if (data[i].outcome === 'You Won!'){
				data[i].newClass = 'success';
			}else{
				data[i].newClass = 'danger';
			}
		}
		$scope.result = data;
	}).error(function() {
		console.log('could not get recent matches');
	});

	$scope.search = function(btcAdd){
		$http({
			method: 'GET',
			url: '/results/' + btcAdd
		}).success(function(data) {
			console.log('Recent matches recieved!');
			for (var i = 0; i < data.length; i++){
				data[i].yourTroops = Math.round((data[i].yourTroops * 0.9) * 1000) / 1000;
				data[i].oppTroops = Math.round((data[i].oppTroops * 0.9) * 1000) / 1000;
				if (data[i].outcome === 'You Won!'){
					data[i].newClass = 'success';
				}else{
					data[i].newClass = 'danger';
				}
			}
			$scope.result = data;
		}).error(function() {
			console.log('could not get recent matches');
		});
	};
});
