(function(demo){
	'use strict';

	demo.config(function ($routeProvider, $locationProvider) {
		$routeProvider
		.when('/', {
			templateUrl: "../html/main.html",
			controller: 'AppCtlr',
		});
	});

	demo.controller('AppCtlr', function(){

	});
})(angular.module('app', [
	'ngResource',
	'ngSanitize',
	'ngRoute'
]));
