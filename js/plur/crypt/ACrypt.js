/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject
 * @module plur/crypt/ACrypt
 */

define([
    'plur/PlurObject',
    'plur/config/Config' ],
function(
    PlurObject,
    Config ) {

/**
 * Base class for ICrypt implementations.
 *
 * @class plur/crypt/ACrypt
 * @alias {module:plur/crypt/ACrypt}
 **
 * @param plur/config/Config config
 */
var ACrypt = function(config) {
    if (this.namepath === ACrypt.namepath) {
        throw new AbstractError({'this': this});
    }

    this._config =  ACrypt.getDefaultConfig().merge(config);
};


ACrypt.prototype = PlurObject.create('plur/crypt/ACrypt', ACrypt);
PlurObject.implement(ACrypt, ICrypt);
PlurObject.implement(ACrypt, Config.IConfigured);

ACrypt._DEFAULT_CONFIG = new ConstructorConfig(ACrypt, null, { crypt: {} });

ACrypt.getDefaultConfig = function() {
    return ACrypt._DEFAULT_CONFIG;
};

ACrypt.prototype.getConfig = function() {
    return this._config;
};

ACrypt.prototype.config = function() {
    return this._config.config();
};

ACrypt.prototype.createUUID = function() {
    return UUID.get().create();
};

return ACrypt;
});