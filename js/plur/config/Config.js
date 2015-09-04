/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject plur/obj/Parser
 */
define([
    'plur/PlurObject',
    'plur/obj/Parser' ],
function(
    PlurObject,
    PlurObjParser ) {

/**
 * Maintains key/value configuration for a subject object, typically for a prototype.
 * @var plur/configConfig
 **
 * @function plur/config/Config
 * @param subjectNamepath The namepath of the subject
 * @param baseConfig Optional parent configuration to be merged.
 */
var Config = function(subjectNamepath, baseConfig) {
	this._subjectNamepath = subjectNamepath;

	if (typeof baseConfig !== 'undefined') {
		this.merge(baseConfig);
	}
};

Config._environment = {};

Config.fromObj = function(obj, instance) {
	if (!instance) {
		instance = new Config(obj.subjectNamepath);
	}

	return instance.merge(obj);
}

Config.mergeEnvironment = function(configs) {
	if (typeof configs.length === 'undefined') {
		configs = [configs];
	}
	
	for (let i = 0; i < configs.length; ++i) {
		var config = configs[i];
		if (typeof this._environment[config.subjectNamepath] === 'undefined') {
			this._environment[config.subjectNamepath] = config;
		} else {
			this._environment[config.subjectNamepath].merge(config);
		}
	}
};

Config.prototype = PlurObject.create('plur/config/Config', Config);

Config.prototype.merge = function(config) {
    for (var key in config) {
        if (this._isConfigField(key, config[key])) {
            this[key] = config[key];
        }
    }

    return this;
};
	
Config.prototype.getSubjectNamepath = function() {
    return this._subjectNamepath;
};
	
Config.prototype.toObj: function() {
    var o = this.prototype.fromObj();
    o.subjectNamepath = this._subjectNamepath;

    // config keys
    for (var key in this) {
        if (this._isConfigField(key, this[key])) {
            o[key] = this[key];
        }
    }

    return o;
};
	
Config.prototype._isConfigField: function(name, value) {
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
};

return Config;
});