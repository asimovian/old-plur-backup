/**
 * @copyright 2017 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @module plur/app/IApplication
 * @requires plur/PlurObject
 */
'use strict';

define([
    'plur/PlurObject'
    'plur/error/Interface' ],
function(
    PlurObject,
    InterfaceError ) {

/**
 * Basic interface for all applications (shell, web, etc.). Simple start / stop / status interface.
 *
 * Applications, by design, should be extremely basic -- simply a driver for starting/stopping the local Plur Node and
 * for starting the Application's main Service. The main Service class should perform all real setup, teardown, and
 * logic.
 *
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
 * Bitwise status flags for use with IApplication.prototype.status().
 * Services may provide more flags not including those reserved here (0x00 thru 0x18).
 *
 * Combining different flags signal different events. E.g.;
 *   OFFLINE | PAUSED | STOPPED => Service was paused before it was stopped.
 *   ONLINE | INIT | PAUSED => Service was paused during INIT
 *   OFFLINE | INIT | ERROR => Service crashed during INIT
 */
IService.Status = {
    OFFLINE:        0x00,
    ONLINE:         0x01,
    INIT:           0x02,
    RUNNING:        0x04, // cannot be OFFLINE, INIT, PAUSED, STOPPED
    PAUSED:         0x08, // cannot be INIT, RUNNING, STOPPED
    STOPPED:        0x10, // cannot be ONLINE, RUNNING, PAUSED
    WARNING:        0x12,
    ERROR:          0x14, // cannot be ONLINE
    //RESERVED:     0x18 through 0x28
};

/**
 * Starts the plur node, registers and starts the application's main service.
 *
 * @function plur/app/Application.prototype.start
 * @abstract
 */
IApplication.prototype.start = PlurObject.abstractMethod;

/**
 * Stops the application, performing any cleanup necessary.
 *
 * @function plur/app/Application.prototype.start
 * @abstract
 */
IApplication.prototype.stop = PlurObject.abstractMethod,

/**
 * Retrieves the plur node attached to this application.
 *
 * @returns {module:plur/node/INode}
 * @abstract
 */
IApplication.prototype.plurNode = PlurObject.abstractMethod;

/**
 * Retrieves the application's main service.
 *
 * @returns {module:plur/service/IService}
 * @abstract
 */
IApplication.prototype.service = PlurObject.abstractMethod;

PlurObject.plurify('plur/app/IApplication', IApplication);

return IApplication;
});