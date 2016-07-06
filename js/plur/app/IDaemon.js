/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject plur/app/Application
 */
define([
    'plur/PlurObject' ],
function(
    PlurObject,
    IApplication ) {

/**
 * @constructor plur/app/IDaemon
 * @extends plur/app/IApplication
 * @interface
 */
var Daemon = function() { throw new InterfaceError({'this': this})};

IDaemon.prototype = PlurObject.create('plur/app/Daemon', IDaemon, IApplication);

return IDaemon;
});