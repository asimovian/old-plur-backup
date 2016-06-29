/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject plur/app/Application
 */
define([
    'plur/PlurObject' ],
function(
    PlurObject,
    Application ) {

/**
 * @constructor plur/app/Daemon
 * @extends plur/app/Application
 * @abstract
 */
var Daemon = function() {
};

Daemon.prototype = PlurObject.create('plur/app/Daemon', Daemon, Application);

/**
 * Starts the application
 *
 * @function plur/app/Application.prototype.start
 * @abstract
 */
Daemon.prototype.start = PlurObject.abstractMethod;
	
/**
 * Stops the application
 *
 * @function plur/app/Application.prototype.start
 * @abstract
 */
Daemon.prototype.stop = PlurObject.abstractMethod,
	
/**
 * Performs a heartbeat operation (e.g., periodic maintenance, metrics reporting, etc.)
 *
 * @function plur/app/Application.prototype.heartbeat
 * @abstract
 */
Daemon.prototype.heartbeat = PlurObject.abstractMethod;

return Daemon;
});