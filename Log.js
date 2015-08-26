/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/event/Emitter
 */
define(['plur/event/Emitter'], function(Emitter) {

/**
 * A simple logging interface. Intended to be used a singleton.
 *
 * @var plur/Log
 **
 * @function plur/Log
 */
var Log = function() {
	this.emitter = new Emitter();
};

/**
 * Logs a debugging message with data.
 *
 * @function plur/Log.prototype.debug
 * @param string message
 * @param {} data
 */
Log.prototype.debug = function(message, data) {
	this.emitter.emit('debug', { type: 'debug', message: message, data: data });
};

/**
 * @var Log plur/Log.singleton
 */
Log.singleton = new Log();

return Log.singleton;
});
