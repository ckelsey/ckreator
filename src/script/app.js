(function(ckreator){
	'use strict';
	ckreator.config(function ($routeProvider, $locationProvider) {
		$routeProvider
		.when('/', {
			templateUrl: "../html/main.html",
			controller: 'CKreatorCtlr',
		})
		.otherwise({ redirectTo: '/' });
		$locationProvider.html5Mode(true);
	});

	ckreator.controller('CKreatorCtlr', function(){
		var self = this;
	});
})(angular.module('ckreator', [
	'ngResource',
	'ngSanitize',
	'ngRoute',
	'utility_module',
	'ngStorage'
]));
