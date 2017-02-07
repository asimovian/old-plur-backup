/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @module plur/app/IApplication
 * @requires plur/PlurObject plur/app/Application
 */
'use strict';

define([
    'plur/PlurObject' ],
function(
    PlurObject ) {

/**
 * @class IApplication
 * @interface
 * @alias {module:plur/app/IApplication}
 */
class IApplication {
    constructor() {
        throw new InterfaceError({'this': this});
    };
}

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


PlurObject.plurify('plur/app/IApplication', IApplication);

return IApplication;
});