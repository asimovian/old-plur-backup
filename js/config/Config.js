/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 */
define(['plur/obj/Parser'], function(PlurObjParser) {
	
var Config = function(configuredNamepath, baseConfig) {
	this._configuredNamepath = configuredNamepath;
	if (typeof 'baseConfig' !== 'undefined') {
		this.merge(baseConfig);
	}
};

Config._environment = {};

Config.fromObj = function(obj, instance) {
	if (!instance) {
		instance = new Config(obj.configuredNamepath);
	}

	return instance.merge(obj);
}

Config.mergeEnvironment = function(configs) {
	if (typeof configs.length === 'undefined') {
		configs = [configs];
	}
	
	for (var i = 0; i < configs.length; ++i) {
		var config = configs[i];
		if (typeof this._environment[config.configuredNamepath] === 'undefined') {
			this._environment[config.configuredNamepath] = config;
		} else {
			this._environment[config.configuredNamepath].merge(config);
		}
	}
};

PlurObject.createClass('plur/config/Config', Config, PlurObject, {
	merge: function(config) {
		for (var key in config) {
			if (this._isConfigField(key, config[key])) {
				this[key] = config[key];
			}
		}
		
		return this;
	},
	
	getConfiguredNamepath: function() {
		return this._configuredNamepath;
	},
	
	toObj: function() {
		var o = this.prototype.fromObj();
		o.configuredNamepath = this._configuredNamepath;
		// config keys
		for (var key in this) {
			if (this._isConfigField(key, this[key])) {
				o[key] = this[key];
			}
		}
		
		return o;
	},
	
	_isConfigField: function(name, value) {
		if (name.match(/^_/) || name === 'namepath') {
			return false;
		}
		
		switch(typeof value) {
		case 'object':
			if (typeof value.length === 'undefined') {
				return false;
			}
			break;
			
		case 'function':
		case 'undefined':
			return false;
		}
		
		return true;
	}
});

return Config;
});