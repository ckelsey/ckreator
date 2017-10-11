(function(ckreator){
	'use strict';

	ckreator.directive('projectsNewDialogue', function(CONF, projectsApi){
		return {
			restrict: 'E',
			scope:{},
			templateUrl: '../html/projects-new-dialogue.html',
			link: function(scope, element){
				scope.frameworks = CONF.frameworks;
				scope.projectsApi = projectsApi;
			}
		};
	});
})(angular.module('ckreator'));
