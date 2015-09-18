/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject
 */
 'use strict';

define([
    'plur/PlurObject' ],
function(
    PlurObject ) {

/**
 * Bootstrap
 *
 * @constructor plur/Bootstrap
 **
 */
var Bootstrap = function(platformBootstrap) {
    this._require = platformBootstrap.require;
    this._platformType = platformBootstrap.platformType;
};

Bootstrap.prototype = PlurObject.create('plur/Bootstrap', Bootstrap);

Bootstrap.Platform = {
    NodeJs: 'nodejs',
    Web: 'web'
};

Bootstrap.singleton = null;

Bootstrap.init = function(bootstrap) {
    Bootstrap.singleton = bootstrap;
};

Bootstrap.get = function() {
    return Bootstrap.singleton;
};

Bootstrap.prototype.getRequireConfig = function() {
    return this._require.s.contexts._.config;
};

Bootstrap.prototype.addPath = function(name, path) {
    this.getRequireConfig().paths[name] = path;
};

Bootstrap.prototype.getPlatformType = function() {
    return this._platformType;
};

return Bootstrap;
});