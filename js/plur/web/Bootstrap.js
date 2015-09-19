/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject
 */
 'use strict';

define([
    'plur/PlurObject',
    'plur/bootstrap/Bootstrap' ],
function(
    PlurObject,
    Bootstrap ) {

/**
 * Web Bootstrap
 *
 * @constructor plur/web/Bootstrap
 * @extends plur/bootstrap/Bootstrap
 **
 */
var WebBootstrap = function(platformBootstrap) {
    Bootstrap.call(this, platformBootstrap) ;
};

WebBootstrap.prototype = PlurObject.create('plur/web/Bootstrap', WebBootstrap, Bootstrap);

WebBootstrap.init = function(platformBootstrap) {
    Bootstrap.init(new WebBootstrap(platformBootstrap));
    return Bootstrap.get();
};

WebBootstrap.get = function() {
    return Bootstrap.get();
};

return WebBootstrap;
});