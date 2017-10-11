var restify = require('restify');
var fs = require('fs');

//Gather Controllers
var controllers = {};
var controllers_path = process.cwd() + '/api/controllers';
fs.readdirSync(controllers_path).forEach(function (file) {
	if (file.indexOf('.js') != -1 && file.indexOf('.swp') == -1) {
		controllers[file.split('.')[0]] = require(controllers_path + '/' + file);
	}
});



//Config Server
var server = restify.createServer({
	name: 'api.ckreator'
});


/* CORS */

restify.CORS.ALLOW_HEADERS.push('Accept-Encoding');
restify.CORS.ALLOW_HEADERS.push('Accept-Language');
restify.CORS.ALLOW_HEADERS.push('Authorization');
restify.CORS.ALLOW_HEADERS.push('DNT');
restify.CORS.ALLOW_HEADERS.push('X-CustomHeader');
restify.CORS.ALLOW_HEADERS.push('Keep-Alive');
restify.CORS.ALLOW_HEADERS.push('User-Agent');
restify.CORS.ALLOW_HEADERS.push('X-Requested-With');
restify.CORS.ALLOW_HEADERS.push('If-Modified-Since');
restify.CORS.ALLOW_HEADERS.push('Cache-Control');
restify.CORS.ALLOW_HEADERS.push('Content-Type');

server.use(
	function crossOrigin(req,res,next){
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
		res.header("Access-Control-Allow-Headers", "Authorization,DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Accept-Encoding,Accept-Language");
		return next();
	}
);

// Manually implement the method not allowed handler to fix failing preflights
//
server.on( "MethodNotAllowed", function( request, response ){

	if ( request.method.toUpperCase() === "OPTIONS" ){

		// Send the CORS headers
		response.header( "Access-Control-Allow-Credentials", true                                    );
		response.header( "Access-Control-Allow-Headers",     restify.CORS.ALLOW_HEADERS.join( ", " ) );
		response.header( "Access-Control-Allow-Methods",     "GET, POST, PUT, DELETE, OPTIONS"       );
		response.header( "Access-Control-Allow-Origin",      request.headers.origin                  );
		response.header( "Access-Control-Max-Age",           0                                       );
		response.header( "Content-type",                     "text/plain charset=UTF-8"              );
		response.header( "Content-length",                   0                                       );

		response.send( 204 );
	}else{
		response.send( new restify.MethodNotAllowedError() );
	}
});

server.use(restify.CORS());

/* END CORS */









server.use(restify.fullResponse());
server.use(restify.queryParser());
server.use(restify.bodyParser());




//Set Routes
server.get("/", function(req, res, next){
	res.json({
		status: "success"
	});
	next();
});

server.get("/files", controllers.files.list);

server.get("/projects", controllers.projects.list);
server.get("/projects/start", controllers.projects.start);
server.get("/projects/stop", controllers.projects.stop);
server.post("/projects", controllers.projects.newProject);



server.get(/\/tmp\/?.*/, restify.serveStatic({
	directory: __dirname
}));




var port = process.env.PORT || 8601;
server.listen(port, function(err){
	if(err){
		console.error(err);
	}else{
		console.log(server.name + ' is ready at : ' + port);
	}
});
