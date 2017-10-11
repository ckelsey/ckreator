var fs = require('fs'),
path = require('path'),
mime = require('mime-types');

function getUserHome() {
  return process.env.HOME || process.env.USERPROFILE;
}

function listItems(pathToGet, cb) {
	var items = {};
	pathToGet = path.resolve(pathToGet);

	try{
		fs.access(pathToGet, fs.constants.R_OK, function(err){
			if(!err){
				fs.readdirSync(pathToGet).forEach(function (file) {
					var meta = fs.statSync(path.resolve(pathToGet, file));

					items[file] = {
						name: file,
						path: path.resolve(pathToGet, file),
						created: meta.birthtime,
						modified: meta.mtime,
						type: meta.isDirectory() ? 'folder' : 'file',
						mimeType: mime.lookup(file)
					};
				});

				return cb(null, items);
			}else{
				return cb(err, null);
			}
		});
	}catch(e){
		return cb(e, null);
	}
}

exports.listItems = function(pathToGet, cb) {
	return listItems(pathToGet, cb);
};

exports.list = function(req, res, next) {
	var files = {};
	// var pathToGet = path.resolve(getUserHome(), req.params.path);
	var pathToGet = path.resolve(req.params.path);

	listItems(pathToGet, function(err, items){
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
