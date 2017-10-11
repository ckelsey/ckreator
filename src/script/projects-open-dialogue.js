(function(ckreator){
	'use strict';

	ckreator.directive('projectsOpenDialogue', function(CONF, projectsApi){
		return {
			restrict: 'E',
			scope:{},
			templateUrl: '../html/projects-open-dialogue.html',
			link: function(scope, element){
				scope.projectsApi = projectsApi;
				projectsApi.getProjects();
			}
		};
	});
})(angular.module('ckreator'));
