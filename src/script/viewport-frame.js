(function(ckreator){
	'use strict';

	ckreator.directive('viewportFrame', function($sce, $http, $timeout, CONF, projectsApi){
		return {
			restrict: 'E',
			scope:{},
			templateUrl: '../html/viewport-frame.html',
			link: function(scope, element){

				scope.projectsApi = projectsApi;

				scope.$watch(function(){
					return projectsApi.project ? projectsApi.project.running : false;
				}, function(newVal, oldVal){

					if(newVal && newVal !== oldVal){
						if(newVal){
							scope.url = $sce.trustAsResourceUrl(projectsApi.url);
						}else{
							scope.url = null;
						}
					}
				});
			}
		};
	});
})(angular.module('ckreator'));
