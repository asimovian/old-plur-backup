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
var Bootstrap = function(requirejs) {
    this.require = requirejs;
};

Bootstrap.prototype = PlurObject.create('plur/Bootstrap', Bootstrap);

Bootstrap.prototype.getRequireConfig = function() {
    return this.require.s.contexts._.config;
};

Bootstrap.prototype.addPath = function(name, path) {
    this.getRequireConfig().paths[name] = path;
};

return Bootstrap;
});