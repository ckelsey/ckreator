(function(ckreator){
	'use strict';

	ckreator.directive('menuBar', function(CONF, projectsApi){
		return {
			restrict: 'E',
			scope:{},
			templateUrl: '../html/menu-bar.html',
			link: function(scope, element){
				scope.items = {
					Projects: {
						options: {
							New: function() { projectsApi.newProjectDialogueOpen = true; },
							Open: function() { projectsApi.openProjectDialogueOpen = true; }
						}
					}
				};

				scope.$watch(function(){
					return projectsApi.project ? projectsApi.project.path : false;
				}, function(newVal, oldVal){
					if(newVal && newVal !== oldVal){
						delete scope.items.Projects.options.Stop;
						scope.items.Projects.options.Start = function(){ projectsApi.startProject(); };
					}else if(newVal !== oldVal){
						delete scope.items.Projects.options.Start;
						scope.items.Projects.options.Stop = function(){ projectsApi.stopProject(); };
					}
				});

				scope.$watch(function(){
					return projectsApi.project ? projectsApi.project.running : false;
				}, function(newVal, oldVal){
					if(newVal && newVal !== oldVal){
						delete scope.items.Projects.options.Start;
						scope.items.Projects.options.Stop = function(){ projectsApi.stopProject(); };
					}else if(newVal !== oldVal){
						delete scope.items.Projects.options.Stop;
						scope.items.Projects.options.Start = function(){ projectsApi.startProject(); };
					}
				});
			}
		};
	});
})(angular.module('ckreator'));
