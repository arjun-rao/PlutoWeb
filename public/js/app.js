(function() {
	var app = angular.module('angularApp', []);
	
	app.controller('nlcController', [ '$scope', '$http', function($scope, $http) {
		$scope.payload = '';
		$scope.result = '';
		$scope.showResult = false;

		$scope.onSubmit = function() {
			$http.post('/analyze', { payload: $scope.payload })
			.then(function successCallback(response) {
				$scope.result = JSON.stringify(response.data.entities)+'\n'+JSON.stringify(response.data.docEmotions);					
				//console.log(response);
				$scope.showResult = true;
			}, function errorCallback(response) {
				$scope.result = 'Oops! Something went wrong :(';
				$scope.showResult = true;
			});
		};
	}]);
})();
