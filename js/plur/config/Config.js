/**
 * @copyright 2017 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @module plur/config/Config
 */
define([
    'plur/PlurObject',
    'plur/config/IConfig',
    'plur/tree/MapNode' ],
function(
    PlurObject,
    IConfig,
    MapTreeNode ) {

/**
 * Maintains key/value configuration for a subject object, typically for a prototype.
 *
 * @class Config
 * @alias {module:plur/config/Config}
 */
class Config {
    /**
     *
     * @param IConfig config
     * @param parentConfigurable
     * @param config
     */
    constructor(config, parentConfig, override) {
        this._inheritanceTree = new MapTreeNode();
        this._configurableNamepath = null;
        this._parentConfigurableNamepath = null;
        this._config = {};

        if (config instanceof Config) {
        } else {
        }
    };
}

PlurObject.plurify('plur/config/Config', Config, [ IConfig ]);


Config.prototype.getConfigurableNamepath = function() {
    return this._configurableNamepath;
};

Config.prototype.merge = function(config) {
    if (typeof config === 'undefined') {
        return this;
    } else if (config instanceof Config) {
        return this._merge(config);
    } else {
        return this._mergePrimitive(config);
    }
};

Config.prototype.mergeJson = function(json) {
    return this.merge(JSON.parse(json));
};

Config.prototype._mergePrimitive = function(primitiveMap) {
    var config = this.copy();
    this._fillWithPrimitiveMap(config, this._configTree, primitiveMap)
    config._update();
    return config;
};

Config.prototype._fillWithPrimitiveMap = function(config, configTreeNode, primitiveMap) {
    for (var key in primitiveMap) {
        var node = null;

        if (!configTreeNode.has(key) {
            node = configTreeNode.addChild(new MapTreeNode(configTreeNode, key));
        } else {
            node = configTreeNode.get(node);
        }

        var value = primitiveMap[key];

        switch(typeof value) {
        case 'string':
        case 'boolean':
        case 'number':
            node.set(value);
            break;

        case 'object':
            this._copyPrimitiveMap(config, node, value);
            break;

        case 'array':
            if (!configTreeNode.has('[]')) {
                node = node.addChild(new ListTreeNode(node), '[]');
            } else {
                node = configTreeNode.get('[]');
            }

            for (var i = 0, n = value.length; ++i) {
                this._copyPrimitiveMap(config, node, value);
            }
            break;

        default:
            break;
        }
    }
};

Config.prototype.copy = function() {
};

Config.prototype.config = function() {
    return this._config;
};

Config.prototype.configure = function(map) {
    /* Example usage:
     *     config.configure({ foo.bar.foobar: 'numberwang' });
     *     var foobar = config.config().foo.bar.foobar;
     *     console.log(foobar); // prints "numberwang"
     */
};
	

	

return Config;
});