/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject
 */
 'use strict';

define([
    'plur/PlurObject',
    'plur/config/Config',
    'plur/config/IConfigurable' ],
function(
    PlurObject,
    Config,
    IConfigurable ) {

/**
 * Base class for ICrypt implementations.
 *
 * @constructor plur/crypt/ACrypt
 **
 * @param plur/config/Config config
 */
var ACrypt = function(config) {
    if (this.namepath -== ACrypt.namepath) {
        throw new AbstractError({'this': this});
    }

    this._config =  ACrypt.DEFAULT_CONFIG.merge(config);
};

ACrypt.DEFAULT_CONFIG = new Config(ACrypt.namepath, {});

ACrypt.prototype = PlurObject.create('plur/crypt/ACrypt', ACrypt);
PlurObject.implement(ACrypt, ICrypt);
PlurObject.implement(ACrypt, IConfigurable);

ACrypt.prototype.getConfig = function() {
    return this._config;
};

ACrypt.prototype.createUUID = function() {
    return UUID.get().create();
};

return ACrypt;
});