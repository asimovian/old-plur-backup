/**
 * @copyright 2017 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @module plur/service/IService
 * @requires plur/PlurObject
 */
'use strict';

define([
    'plur/PlurObject',
    'plur/error/Interface' ],
function(
    PlurObject,
    InterfaceError ) {

/**
 * Basic interface for all services. Simple start / stop / status interface.
 * 
 * Services provide the various core features of a running application.
 * Services run within an Application, which simply a driver for starting and stopping the local Plur Node and the
 * main Application service.
 *
 * @class IService
 * @interface
 * @alias {module:plur/app/IService}
 */
class IService {
    constructor() {
        throw new InterfaceError({'this': this});
    };
}

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
    OFFLINE:        0x00,
    ONLINE:         0x01,
    INIT:           0x02,
    RUNNING:        0x04, // cannot be OFFLINE, INIT, PAUSED, STOPPED
    PAUSED:         0x08, // cannot be INIT, RUNNING, STOPPED
    STOPPED:        0x10, // cannot be ONLINE, RUNNING, PAUSED
    WARNING:        0x12,
    ERROR:          0x14, // cannot be ONLINE
    //RESERVED:     0x18 thru 0x28
};

/**
 * Starts the plur node, registers and starts the service's main service.
 *
 * @function plur/app/Service.prototype.start
 * @abstract
 */
IService.prototype.start = PlurObject.abstractMethod;

/**
 * Stops the service, performing any cleanup necessary.
 *
 * @function plur/app/Service.prototype.start
 * @abstract
 */
IService.prototype.stop = PlurObject.abstractMethod,

/**
 * Retrieves the current status of this service.
 *
 * @function plur/app/Service.prototype.status
 * @abstract
 */
IService.prototype.status = PlurObject.abstractMethod;


PlurObject.plurify('plur/app/IService', IService);

return IService;
});