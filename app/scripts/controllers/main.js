'use strict';

angular.module('duelbitsApp')
  .controller('MainCtrl', [ '$scope', '$window', '$modal', '$log', '$http', '$cookies', function ($scope, $window, $modal, $log, $http, $cookies) {
	
	$http.get('/api/awesomeThings').success(function(awesomeThings) {
		$scope.awesomeThings = awesomeThings;
	});
	$scope.btcLength = false;
	$scope.isLoading = true;
	$scope.btcAdd = $cookies.btcAdd;
	
	if ($window.document.width < 700) {
		console.log('isMobile');
		$scope.isMobile = true;
	}else {
		console.log('isNotMobile');
		$scope.isMobile = false;
	}

	if ($scope.btcAdd === undefined){

		var modalInstance = $modal.open({
			templateUrl: '/partials/myModalContent.html',
			backdrop: false
		});

		modalInstance.result.then(function (btcAdd) {
			$cookies.btcAdd = btcAdd;
			$scope.btcAdd = $cookies.btcAdd;
			$scope.btcLength = true;

			$http({
				method: 'POST',
				url: '/pay/' + btcAdd
			}).success(function(data) {
				console.log('deposit address created');
				$scope.isLoading = false;
				$cookies.depAdd = data;
				$scope.depAdd = $cookies.depAdd;
			}).error(function() {
				console.log('could not create deposit address');
			});
		}, function () {
			$log.info('Modal dismissed at: ' + new Date());
		});
	} else{
		$scope.btcLength = true;
		$scope.isLoading = false;
		$scope.depAdd = $cookies.depAdd;
	}

	$scope.updateAdd = function() {

		$scope.btcLength = false;
		$scope.isLoading = true;

		var modalInstance = $modal.open({
			templateUrl: '/partials/myModalContent.html',
			backdrop: false
		});

		modalInstance.result.then(function (btcAdd) {
			$cookies.btcAdd = btcAdd;
			$scope.btcAdd = $cookies.btcAdd;
			$scope.btcLength = true;

			$http({
				method: 'POST',
				url: '/pay/' + btcAdd
			}).success(function(data) {
				console.log('deposit address created');
				console.log(data);
				$scope.isLoading = false;
				$cookies.depAdd = data;
				$scope.depAdd = $cookies.depAdd;
			}).error(function() {
				console.log('could not create deposit address');
			});
		}, function () {
			$log.info('Modal dismissed at: ' + new Date());
		});

	};

}]);
