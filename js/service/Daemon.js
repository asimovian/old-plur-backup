define(function() { // no indent
	
var Daemon = function() {
	
};

Daemon.CLASSPATH = 'plur/service/Daemon.js';
Daemon.prototype.CLASSPATH = Daemon.CLASSPATH;

Daemon.prototype = {
	CLASSPATH: Daemon.CLASSPATH,
	
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