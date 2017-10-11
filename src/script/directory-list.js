(function(ckreator){
	'use strict';

	ckreator.directive('directoryList', function(filesApi){
		return {
			restrict: 'E',
			templateUrl: '../html/directory-list.html',
			link: function(scope, element){
				// apiService.getFiles('api/').then(function(res){
				// 	console.log(res);
				// 	//scope.directory = res.data;
				// }, function(res){
				// 	/* TODO error handle */
				// 	console.log(res);
				// });

				// filesApi.getProjects().then(function(res){
				// 	console.log(res);
				// 	scope.directory = res.data;
				// }, function(res){
				// 	/* TODO error handle */
				// 	console.log(res);
				// });
			}
		};
	});
})(angular.module('ckreator'));
