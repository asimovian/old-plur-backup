define(['plur/obj/Parser'], function(PlurObjParser) { // no indent
	
var Config = function(configuredClasspath, baseConfig) {
	this._configuredClasspath = configuredClasspath;
	if (typeof 'baseConfig' !== 'undefined') {
		this.merge(baseConfig);
	}
};

Config._environment = {};

Config.fromObj = function(obj, instance) {
	if (!instance) {
		instance = new Config(obj.configuredClasspath);
	}

	return instance.merge(obj);
}

Config.mergeEnvironment = function(configs) {
	if (typeof configs.length === 'undefined') {
		configs = [configs];
	}
	
	for (var i = 0; i < configs.length; ++i) {
		var config = configs[i];
		if (typeof this._environment[config.configuredClasspath] === 'undefined') {
			this._environment[config.configuredClasspath] = config;
		} else {
			this._environment[config.configuredClasspath].merge(config);
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
	
	getConfiguredClasspath: function() {
		return this._configuredClasspath;
	},
	
	toObj: function() {
		var o = this.prototype.fromObj();
		o.configuredClasspath = this._configuredClasspath;
		// config keys
		for (var key in this) {
			if (this._isConfigField(key, this[key])) {
				o[key] = this[key];
			}
		}
		
		return o;
	},
	
	_isConfigField: function(name, value) {
		if (name.match(/^_/) || name === 'CLASSPATH') {
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
}); // no indent