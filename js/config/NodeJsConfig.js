/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 */
define(['fs', 'plur/config/Config', 'plur/file/System', 'plur/obj/Parser'], function(fs, PlurConfig, PlurFileSystem, PlurObjParser) { // no indent
	
var NodeJs = function(configuredNamepath, baseConfig) {
	PlurConfig.call(this, configuredNamepath, baseConfig);
	this._jsonNamepath = configuredNamepath + '.json';

	var fileSystem = PlurFileSystem.get();
	// parse defaults first
	var defaultsFilepath = fileSystem.getResourcePath(this._jsonNamepath);
	var json = fs.readFileSync(defaultsFilepath, 'utf8');
	if (json !== null) {
		var obj = JSON.parse(json);
		PlurConfig.parseObj(obj, this);
	}

	// parse config
	var configFilepath = fileSystem.getConfigPath(this._jsonNamepath);
	var json = fs.readFileSync(configFilepath, 'utf8');
	if (json !== null) {
		var obj = JSON.parse(json);
		PlurConfig.parseObj(obj, this);
	}
};

NodeJs.namepath = 'plur/service/daemon/NodeJs.js';

NodeJs.prototype = new PlurConfig();
NodeJs.prototype.namepath = NodeJs.namepath;
NodeJs.prototype.CONFIGPATH = NodeJs.CONFIGPATH;

NodeJs.prototype.write = function(filepath, callback) {
	if (typeof(filepath) === 'undefined') {
		filepath = PlurFileSystem.get().getResourcePath(this._jsonNamepath);
	}
	
	var json = JSON.stringify(this.getObj());
	fs.fileWrite(filepath, json, callback);
};

return NodeJs;
}); // no indent