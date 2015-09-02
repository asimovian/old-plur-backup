/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/event/Emitter
 */
define(['plur/event/Emitter'], function(Emitter) {

/**
 * A simple logging interface. Intended to be used a singleton. Loggers can attach to this object's emitter to
 * catch logging messages.
 *
 * @var plur/Log
 **
 * @function plur/Log
 */
var Log = function() {
	this._emitter = new Emitter();
};

/**
 * Logs a typical information message.
 *
 * @function plur/Log.prototype.info
 * @param string message
 * @param {} data
 */
Log.prototype.info = function(message, data) {
	this._emitter.emit('info', { type: 'info', message: message, data: data });
};

/**
 * Logs a debugging message with data.
 *
 * @function plur/Log.prototype.debug
 * @param string message
 * @param {} data
 */
Log.prototype.debug = function(message, data) {
	this._emitter.emit('debug', { type: 'debug', message: message, data: data });
};

/**
 * Logs a warning message.
 *
 * @function plur/Log.prototype.warning
 * @param string message
 * @param {} data
 */
Log.prototype.warning = function(message, data) {
	this._emitter.emit('warning', { type: 'warning', message: message, data: data });
};

/**
 * Logs an error message.
 *
 * @function plur/Log.prototype.error
 * @param string message
 * @param {} data
 */
Log.prototype.error = function(message, data) {
	this._emitter.emit('error', { type: 'error', message: message, data: data });
} ;

/**
 * Returns the log's emitter, which can be used to catch logging messages.
 *
 * @function Log.prototype.emitter
 * @returns plur/event/Emitter
 */
Log.prototype.emitter = function() {
    return this._emitter;
};

/**
 * @var Log plur/Log.singleton
 */
Log.singleton = new Log();

return Log.singleton;
});
