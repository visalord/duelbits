'use strict';

angular.module('duelbitsApp')
  .controller('AboutCtrl', function ($scope, $window, $http) {
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
});
