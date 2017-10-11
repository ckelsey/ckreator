(function(ckreator){
	'use strict';

	ckreator.service('projectsApi', function($http, $q, $localStorage, CONF){
		var self = {
			url: CONF.viewportUrl,
			project: {},
			projects: {},
			newProjectDialogueOpen: false,
			openProjectDialogueOpen: false,
			loadingMessage: null,

			loadFromStorage: function(){
				self.project = $localStorage.project;
			},

			getProjects: function(){
				var defer = $q.defer();

				$http.get(CONF.api + 'projects').then(function(res){

					self.projects = res.data;
					defer.resolve(self.projects);

				}, function(res){});

				return defer.promise;
			},

			newProject: function(project){
				var defer = $q.defer();

				self.loadingMessage = 'Creating project';

				$http.post(CONF.api + 'projects', project).then(function(res){
					console.log('s', res);
					self.loadingMessage = null;
					self.newProjectDialogueOpen = false;

					self.getProjects().then(function(res){
						for(var p in res.data){
							if(p === project.name){
								self.project = res.data[p];
								break;
							}
						}

						defer.resolve(self.project);
					});

				}, function(res){
					self.loadingMessage = 'There was an error creating your project, please try again';
					console.log('f',res);
					defer.reject(res.data);
				});

				return defer.promise;
			},

			openProject: function(project){
				console.log(project);
				self.project = project;
				self.openProjectDialogueOpen = false;
			},

			startProject: function(){
				var defer = $q.defer();

				$http.get(CONF.api + 'projects/start', {params:{project: self.project.name}}).then(function(res){
					self.project.running = true;
					defer.resolve(res);
				}, function(res){
					self.project.running = false;
					defer.reject(res);
				});

				return defer.promise;
			},

			stopProject: function(){
				var defer = $q.defer();

				$http.get(CONF.api + 'projects/stop', {params:{project: self.project.name}}).then(function(res){
					self.project.running = false;
					defer.resolve(res);
				}, function(res){
					defer.reject(res);
				});

				return defer.promise;
			}
		};

		return self;
	});
})(angular.module('ckreator'));
