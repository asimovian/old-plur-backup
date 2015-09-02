define(['fs', 'plur/config/Config', 'plur/file/System', 'plur/obj/Parser'], function(fs, PlurConfig, PlurFileSystem, PlurObjParser) { // no indent
	
var NodeJs = function(configuredClasspath, baseConfig) {
	PlurConfig.call(this, configuredClasspath, baseConfig);
	this._jsonClasspath = configuredClasspath + '.json';

	var fileSystem = PlurFileSystem.get();
	// parse defaults first
	var defaultsFilepath = fileSystem.getResourcePath(this._jsonClasspath);
	var json = fs.readFileSync(defaultsFilepath, 'utf8');
	if (json !== null) {
		var obj = JSON.parse(json);
		PlurConfig.parseObj(obj, this);
	}

	// parse config
	var configFilepath = fileSystem.getConfigPath(this._jsonClasspath);
	var json = fs.readFileSync(configFilepath, 'utf8');
	if (json !== null) {
		var obj = JSON.parse(json);
		PlurConfig.parseObj(obj, this);
	}
};

NodeJs.CLASSPATH = 'plur/service/daemon/NodeJs.js';

NodeJs.prototype = new PlurConfig();
NodeJs.prototype.CLASSPATH = NodeJs.CLASSPATH;
NodeJs.prototype.CONFIGPATH = NodeJs.CONFIGPATH;

NodeJs.prototype.write = function(filepath, callback) {
	if (typeof(filepath) === 'undefined') {
		filepath = PlurFileSystem.get().getResourcePath(this._jsonClasspath);
	}
	
	var json = JSON.stringify(this.getObj());
	fs.fileWrite(filepath, json, callback);
};

return NodeJs;
}); // no indent