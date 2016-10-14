(function() {
	var app = angular.module('angularApp', []);
	
	app.controller('nlcController', [ '$scope', '$http', function($scope, $http) {
		$scope.text = '';
		$scope.result = '';
		$scope.showResult = false;

		$scope.onSubmit = function() {
			$http.post('/predict', { text: $scope.text })
			.then(function successCallback(response) {
				$scope.result = 'I think the movie was ' + response.data.classes[0].class_name
					+ ' with a ' + (response.data.classes[0].confidence * 100).toFixed(2) + '% confidence';
				$scope.showResult = true;
			}, function errorCallback(response) {
				$scope.result = 'Oops! Something went wrong :(';
				$scope.showResult = true;
			});
		};
	}]);
})();
