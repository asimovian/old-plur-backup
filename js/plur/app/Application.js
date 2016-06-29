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
 * @constructor plur/app/Application
 * @abstract
 */
var Application = function() {
};

Application.prototype = PlurObject.create('plur/app/Application', Application);

/**
 * Starts the application
 *
 * @function plur/app/Application.prototype.start
 * @virtual
 */
Application.prototype.start = PlurObject.abstractMethod;
	
/**
 * Stops the application
 *
 * @function plur/app/Application.prototype.start
 * @virtual
 */
Application.prototype.stop = PlurObject.abstractMethod,
	
/**
 * Performs a heartbeat operation (e.g., periodic maintenance, metrics reporting, etc.)
 *
 * @function plur/app/Application.prototype.heartbeat
 * @virtual
 */
Application.prototype.heartbeat = PlurObject.abstractMethod;

return Application;
});