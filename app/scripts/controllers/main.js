'use strict';

angular.module('duelbitsApp')
  .controller('MainCtrl', [ '$scope', '$window', function ($scope, $window) {
    

	$scope.isMobile = function(){
		if ($window.document.width < 700) {
			return true;
		}else {
			return false;
		}
	};

}]);
