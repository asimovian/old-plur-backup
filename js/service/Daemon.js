/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject
 */
define([
    'plur/PlurObject' ],
function(
    PlurObject ) {

/**
 * @constructor plur/service/Daemon
 */
var Daemon = function() {
};

Daemon.prototype = PlurObject.create('plur/service/Daemon', Daemon);

/**
 * Starts the daemon
 */
Daemon.prototype.start = PlurObject.pureVirtualFunction;
	
/**
 * Stops the daemon.
 */
Daemon.prototype.stop = PlurObject.pureVirtualFunction,
	
/**
 * Performs a heartbeat operation (e.g., periodic maintenance, metrics reporting, etc.)
 */
Daemon.prototype.heartbeat = PlurObject.pureVirtualFunction;
};

return Daemon;
});