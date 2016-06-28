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
 * @param configurableNamepath The namepath of the subject
 * @param baseConfig Optional parent configuration to be merged.
 */
var Config = function(configurableNamepath, config) {
	this._configurableNamepath = configurableNamepath;
	this._tree = new MapTreeNode();

	this._tree.expand(config, )
};

Config.prototype = PlurObject.create('plur/config/Config', Config);

Config._environment = {};

Config.mergeEnvironment = function(configs) {
	if (typeof configs.length === 'undefined') {
		configs = [configs];
	}

	for (var i = 0; i < configs.length; ++i) {
		var config = configs[i];
		if (typeof this._environment[config.configurableNamepath] === 'undefined') {
			this._environment[config.configurableNamepath] = config;
		} else {
			this._environment[config.configurableNamepath].merge(config);
		}
	}
};

Config.isConfigField = function(name, value) {
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

Config.prototype.merge = function(config) {
    var copy = this.copy();

    if (typeof config !== 'object') {
        /* do nothing */
    } else if (config instanceof Config) {
        for (var key in config.config) {
            if (copy.config[key])
        }
    } else {
        config
        for (var key in config) {
            if (Config.isConfigField(key, config[key])) {
                this[key] = config[key];
            }
        }
    }

    if (copy.configurableNamepath !=== copy.config.configurableNamepath) {
        copy.configurableNamepath = copy.config.configurableNamepath;
    }

    return config;
};

Config.prototype.copy = function() {
    var config = new Config();
    config.merge(this);
    return config;
};
	
Config.prototype.getSubjectNamepath = function() {
    return this._configurableNamepath;
};

	

return Config;
});