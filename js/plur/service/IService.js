/**
 * @copyright 2017 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @module plur/service/IService
 */
'use strict';

define([
    'plur/PlurObject',
    '../config/IConfigurable',
    'plur/event/IEmittable',
    'plur/error/Interface',
    ],
function(
    PlurObject,
    IConfigured,
    IEmittable,
    InterfaceError ) {

/**
 * Basic interface for all services. Simple start / stop / status interface.
 * 
 * Services provide the various core features of a running application.
 * Services run within an Application, which simply a driver for starting and stopping the local Plur Node and the
 * main Application service.
 *
 * @class IService
 * @alias {module:plur/service/IService}
 * @interface
 */
class IService {
    /**
     * @param {module:plur/node/Node} plurNode
     * @param {module:plur/config/Config} config
     */
    constructor(plurNode, config) {
        throw new InterfaceError({'this': this});
    };
}

PlurObject.plurify('plur/service/IService', IService, [IConfigured, IEmittable]);

/**
 * Bitwise status flags for use with IService.prototype.status().
 * Services may provide more flags not including those reserved here (0x00 thru 0x18).
 *
 * Combining different flags signal different events. E.g.;
 *   OFFLINE | PAUSED | STOPPED => Service was paused before it was stopped.
 *   ONLINE | INIT | PAUSED => Service was paused during INIT
 *   OFFLINE | INIT | ERROR => Service crashed during INIT
 */
IService.Status = {
    OFFLINE:        0x00, // not ONLINE
    ONLINE:         0x01, // not OFFLINE
    ERROR:          0x02,
    WARNING:        0x04,
    RUNNING:        0x08, // not OFFLINE, STOPPED, or PAUSED. helper flag.
    STOPPED:        0x10, // not RUNNING
    INIT:           0x12, // not RUNNING
    PAUSED:         0x14, // not RUNNING or STOPPED
    //RESERVED:     0x20 thru 0x28
};

/**
 * Starts the plur node, registers and starts the service's main service.
 *
 * @function plur/service/IService.prototype.start
 * @abstract
 */
IService.prototype.start = PlurObject.abstractMethod;

/**
 * Stops the service, performing any cleanup necessary.
 *
 * @function plur/service/IService.prototype.start
 * @abstract
 */
IService.prototype.stop = PlurObject.abstractMethod,

/**
 * Retrieves the current status of this service.
 *
 * @function plur/service/IService.prototype.status
 * @abstract
 */
IService.prototype.status = PlurObject.abstractMethod;

return IService;
});