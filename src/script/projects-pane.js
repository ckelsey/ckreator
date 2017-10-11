(function(ckreator){
	'use strict';

	ckreator.directive('projectsPane', function(projectsApi){
		return {
			restrict: 'E',
			templateUrl: '../html/projects-pane.html',
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

				scope.projectsApi = projectsApi;

				projectsApi.loadFromStorage();

			}
		};
	});
})(angular.module('ckreator'));
