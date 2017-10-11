var path = require('path');
var fs = require('fs');
var gulp = require('gulp');
var shell = require('shelljs');
var files = require('./files');
var projectPath = path.resolve('api','projects');
var gulpPath = path.resolve('api/templates/gulp.js');
var templatePackage = require('./../templates/package.json');
var appTemplatePath = path.resolve('api/templates/app.js');
var nginxPath = path.resolve('api/viewer.ckreator.loc.conf');

var spawn = require('child_process').spawn;
var gulpProcess, npmProcess;

function makeGulp(args){
	var defer = new Promise( (resolve, reject) => {

		fs.readFile(gulpPath, (err, data) => {

			if (err || !data){
				reject(err || 'No template gulp file');
			}else{

				var folderPath = path.resolve(projectPath, args.name);

				fs.writeFile(path.resolve(folderPath, 'gulpfile.js'), data, (wErr) => {

					if(wErr){
						reject(wErr || 'error writing gulp file');
					}else{
						resolve(null);
					}
				});
			}
		});
	});
	return defer;
}

function resetTemplatePackage(){
	templatePackage.name = null;
	templatePackage.version = null;
	templatePackage.description = null;
	templatePackage.author = null;
	templatePackage.keywords = null;
	templatePackage.license = null;
}

function makePackage(args){
	var defer = new Promise( (resolve, reject) => {

		if(args.name){
			templatePackage.name = args.name.split(' ').join('-').toLowerCase();
		}

		if(args.version){
			templatePackage.version = args.version;
		}

		if(args.description){
			templatePackage.description = args.description;
		}

		if(args.author){
			templatePackage.author = args.author;
		}

		if(args.keywords){
			args.keywords = args.keywords.split(',');
			for(var k=0; k<args.keywords.length; k=k+1){
				args.keywords[k] = args.keywords[k].trim();
			}

			templatePackage.keywords = args.keywords;
		}

		if(args.license){
			templatePackage.license = args.license;
		}

		var folderPath = path.resolve(projectPath, args.name);

		fs.writeFile(path.resolve(folderPath, 'package.json'), JSON.stringify(templatePackage, null, "\t"), (wErr) => {

			if(wErr){
				reject(wErr || 'error writing package file');
			}else{
				resolve(null);
			}
		});
	});
	return defer;
}

function makeBaseFiles(args){
	var defer = new Promise( (resolve, reject) => {

		var folderPath = path.resolve(projectPath, args.name);
		var appPath = path.resolve(folderPath, 'app');
		var appScriptPath = path.resolve(appPath, 'script');
		var appStylePath = path.resolve(appPath, 'style');
		var appHtmlPath = path.resolve(appPath, 'html');
		var modulesPath = path.resolve(folderPath, 'modules');

		try{
			fs.statSync(appPath);
		}catch(e){
			fs.mkdirSync(appPath);
		}

		try{
			fs.statSync(appScriptPath);
		}catch(e){
			fs.mkdirSync(appScriptPath);
		}

		try{
			fs.statSync(appStylePath);
		}catch(e){
			fs.mkdirSync(appStylePath);
		}

		try{
			fs.statSync(appHtmlPath);
		}catch(e){
			fs.mkdirSync(appHtmlPath);
		}

		try{
			fs.statSync(modulesPath);
		}catch(e){
			fs.mkdirSync(modulesPath);
		}

		fs.readFile(appTemplatePath, (err, data) => {

			if (err || !data){
				reject(err || 'No template app.js file');
			}else{

				var folderPath = path.resolve(projectPath, args.name);

				fs.writeFile(path.resolve(appScriptPath, 'app.js'), data, (wErr) => {

					if(wErr){
						reject(wErr || 'error writing app.js file');
					}else{

						var html = '<h1>Welcome, this is a starter page for your new app "'+ args.name +'"</h1>';

						fs.writeFile(path.resolve(appHtmlPath, 'main.html'), html, (hErr) => {

							if(hErr){
								reject(hErr || 'error writing main.html file');
							}else{
								fs.writeFile(path.resolve(appStylePath, 'style.scss'), '', (sErr) => {

									if(sErr){
										reject(sErr || 'error writing style.scss file');
									}else{
										resolve(null);
									}
								});
							}
						});
					}
				});
			}
		});
	});
	return defer;
}

function updateNginx(projectPath){
	var defer = new Promise( (resolve, reject) => {
		fs.readFile(nginxPath, (err, data) => {

			if (err || !data){
				reject(err || 'No nginx file');
			}else{

				if(projectPath.split('')[0] === '/'){
					projectPath = projectPath.split('');
					projectPath.shift();
					projectPath = projectPath.join('');
				}

				data = data.toString().replace(/root \/.*;/g, projectPath);

				fs.writeFile(nginxPath, data, (wErr) => {

					if(wErr){
						reject(wErr || 'error writing nginx file');
					}else{
						resolve(null);
					}
				});
			}
		});
	});
	return defer;
}

exports.list = function(req, res, next) {
	var projects = {};
	var pathToGet = path.resolve('api','projects');

	files.listItems(pathToGet, function(err, items){
		if(!err){
			res.statusCode = 200;
			res.json(items);
			next();
		}else{
			res.statusCode = 302;
			res.json(err);
			next();
		}
	});
};

exports.newProject = function(req, res, next) {
	var body = req.body;

	if(body.name && body.name !== ''){

		var folderPath = path.resolve(projectPath, body.name);

		try{
			fs.statSync(folderPath);
		}catch(e){
			fs.mkdirSync(folderPath);
		}

		Promise.all([
			makeGulp(body),
			makePackage(body),
			makeBaseFiles(body)
		]).then( (values) => {

			try{
				console.log('Starting npm install');
				if(npmProcess){
					npmProcess.kill();
				}

				var hasRsponded = false;

				console.log('Fire npm install');

				//npmProcess = spawn('npm install', [], {cwd: pathToGet});
				npmProcess = spawn('npm', ['install'], {cwd: folderPath});
				npmProcess.stdout.on('data', (data) => {
					console.log(`stdout: ${data}`);
					if(data.indexOf('PROCESS COMPLETED') > -1 && !hasRsponded){
						hasRsponded = true;
						res.statusCode = 200;
						res.json({
							message: 'Running npm install in ' + folderPath
						});
						next();
					}

				});

				npmProcess.stderr.on('data', (data) => {
					console.log(`stderr: ${data}`);
					// if(data.indexOf('fs: re-evaluating') === -1 && !hasRsponded){
					// 	hasRsponded = true;
					// 	res.statusCode = 500;
					// 	res.json({
					// 		message: 'Error running npm'
					// 	});
					// 	next();
					// }
				});

				npmProcess.on('close', (code) => {
					console.log(`child process exited with code ${code}`);
					if(!hasRsponded){
						hasRsponded = true;
						res.statusCode = 500;
						res.json({
							message: 'Closing npm'
						});
						next();
					}
				});
			}catch(e){
				console.log(e);
				res.statusCode = 500;
				res.json({
					message: e
				});
				next();
			}

		}, (reason) => {

			res.statusCode = 302;
			res.json({
				message: reason
			});
			next();
		});
	}else{
		res.statusCode = 302;
		res.json({
			message: 'Invalid arguments'
		});
		next();
	}
};

exports.start = function(req, res, next) {
	var project = req.params.project;
	var pathToGet = path.resolve('api/projects', project);
	var hasRsponded = false;

	Promise.all([
		updateNginx(pathToGet)
	]).then( (values) => {

		var nginxSpawn = require('child_process').exec;

		nginxSpawn('sudo nginx', ['-s', 'reload'], (error, stdout, stderr) => {
			if (error) {
				console.error(`exec error: ${error}`);
				return;
			}
			console.log(`stdout: ${stdout}`);
			console.log(`stderr: ${stderr}`);

			if(gulpProcess){
				gulpProcess.kill();
			}

			gulpProcess = spawn('gulp', [], {cwd: pathToGet});
			gulpProcess.stdout.on('data', (data) => {
				console.log(`stdout: ${data}`);
				if(data.indexOf('Serving files from:') > -1 && !hasRsponded){
					hasRsponded = true;
					res.statusCode = 200;
					res.json({
						message: 'Running gulp in ' + pathToGet
					});
					next();
				}

			});

			gulpProcess.stderr.on('data', (data) => {
				console.log(`stderr: ${data}`);
				if(data.indexOf('fs: re-evaluating') === -1 && !hasRsponded){
					hasRsponded = true;
					res.statusCode = 500;
					res.json({
						message: 'Error running gulp'
					});
					next();
				}
			});

			gulpProcess.on('close', (code) => {
				console.log(`child process exited with code ${code}`);
				if(!hasRsponded){
					hasRsponded = true;
					res.statusCode = 500;
					res.json({
						message: 'Closing gulp'
					});
					next();
				}
			});
		});
	});
};

exports.stop = function(req, res, next) {
	if(gulpProcess){
		gulpProcess.kill();
	}

	res.statusCode = 200;
	res.json({
		message: 'Stopped gulp'
	});
	next();
};
