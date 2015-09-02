/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 */
define(['fs', 'plur/config/Config', 'plur/obj/Parser'], function(fs, PlurConfig, PlurObjParser) { // no indent
	
var System = function() {
	if (typeof(System._instance) !== 'undefined') { // enforce singleton pattern
		throw new PlurException('System singleton already initialized.');
	}
	
	this._homePath = fs.realpathSync('.');
	this._resourcesPath = this._homePath + '/' + System.RESOURCES_PATH;
	this._configPath = this._homePath + '/' + System.CONFIG_PATH;
	this._nodeJsAppPath = this._homePath + '/' + System.NODEJS_APP_PATH;
};

System.CLASSPATH = 'plur/service/daemon/System.js';
System.CONFIG_PATH = 'config';
System.RESOURCES_PATH = 'src/main/resources';
System.NODEJS_APP_PATH = 'src/app/js/plur/nodejs';

System.parseObj = PlurConfig.parseObj;
PlurObjParser.get().registerParser(System.CLASSPATH, System.parseObj);

System.prototype = new PlurConfig();
System.prototype.CLASSPATH = System.CLASSPATH;

System.get = function() {
	if (typeof(System._instance) === 'undefined') {
		System._instance = new System();
	}
	
	return System._instance;	
}

System.prototype = {
	CLASSPATH: System.CLASSPATH,

	getHomePath: function(path) {
		return this.createPath(this._homePath, path);
	},
	
	getResourcePath: function(path) {
		return this.createPath(this._resourcesPath, path);
	},
	
	getConfigPath: function(path) {
		return this.createPath(this._configPath, path);
	},		
	
	getNodeJsAppPath: function(path) {
		return this.createPath(this._nodeJsAppPath, path);
	},
	
	createPath: function(basePath, path) {
		if (typeof(path) === 'undefined') {
			return basePath;
		} else if (path.charAt(0) === '/') {
			return path;
		}
		
		return basePath + '/' + path;		
	},
};

return System;
}); // no indent