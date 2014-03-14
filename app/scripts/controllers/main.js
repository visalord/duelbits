'use strict';

angular.module('duelbitsApp')
  .controller('MainCtrl', [ '$scope', '$window', '$modal', '$log', '$http', function ($scope, $window, $modal, $log, $http) {
    
    $scope.btcLength = false;

		$scope.isMobile = function(){
			if ($window.document.width < 700) {
				return true;
			}else {
				return false;
			}
		};

		var modalInstance = $modal.open({
			templateUrl: '/partials/myModalContent.html',
			backdrop: false
		});

		modalInstance.result.then(function (btcAdd) {
			console.log(btcAdd);
			$scope.btcAdd = btcAdd;
			$scope.btcLength = true;
			var callbackUrl = encodeURIComponent('http://duelbits.herokuapp.com/paid?btcAdd='+btcAdd+'&secret=7UMi8lTZv1OmtT');
			$http({
				method: 'POST',
				url: 'https://blockchain.info/api/receive?method=create&address=18j3TfeSf4MLQsukw7kHiFKj3xhTqfrAD9&callback=' + callbackUrl
			}).success(function(data) {
				console.log('deposit address created');
				console.log(data);
			}).error(function() {
				console.log('could not create deposit address');
			});
		}, function () {
			$log.info('Modal dismissed at: ' + new Date());
		});

	}]);
