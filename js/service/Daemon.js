/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 */
define(function() { // no indent
	
var Daemon = function() {
	
};

Daemon.namepath = 'plur/service/Daemon.js';
Daemon.prototype.namepath = Daemon.namepath;

Daemon.prototype = {
	namepath: Daemon.namepath,
	
	/**
	 * Starts the daemon
	 */
	start: null,
	
	/**
	 * Stops the daemon.
	 */
	stop: null,
	
	/**
	 * Performs a heartbeat operation (e.g., periodic maintenance, metrics reporting, etc.)
	 */
	heartbeat: null,
};

return Daemon;
}); // no indent