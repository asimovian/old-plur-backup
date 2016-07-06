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
 * @interface
 */
var IApplication = function() { throw new InterfaceError({'this': this}); };

IApplication.prototype = PlurObject.create('plur/app/IApplication', IApplication);

/**
 * Starts the application
 *
 * @function plur/app/Application.prototype.start
 * @abstract
 */
IApplication.prototype.start = PlurObject.abstractMethod;
	
/**
 * Stops the application
 *
 * @function plur/app/Application.prototype.start
 * @abstract
 */
IApplication.prototype.stop = PlurObject.abstractMethod,
	
/**
 * Performs a heartbeat operation (e.g., periodic maintenance, metrics reporting, etc.)
 *
 * @function plur/app/Application.prototype.heartbeat
 * @abstract
 */
IApplication.prototype.heartbeat = PlurObject.abstractMethod;

return IApplication;
});