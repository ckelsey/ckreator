(function(ckreator){
	'use strict';

	ckreator.service('filesApi', function($http, CONF){
		var self = {
			getFiles: function(path){
				return $http.get(CONF.api + 'files', {params:{path:path}});
			}
		};

		return self;
	});
})(angular.module('ckreator'));
