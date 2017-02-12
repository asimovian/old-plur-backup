/**
 * @copyright 2017 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @module plur/node/INode
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
 * @class IPlurNode
 * @interface
 * @alias {module:plur/node/INode}
 */
class IPlurNode {
    /**
     * Bitwise status flags for use with IPlurNode.prototype.status().
     * Services may provide more flags not including those reserved here [0x00 - 0x28].
     *
     * Combining different flags signal different events. E.g.;
     *   OFFLINE | PAUSED | STOPPED => Service was paused before it was stopped.
     *   ONLINE | INIT | PAUSED => Service was paused during INIT
     *   OFFLINE | INIT | ERROR => Service crashed during INIT
     *
     * @type {int}
     */
    static Status = {
        OFFLINE:        0x00, // not ONLINE
        ONLINE:         0x01, // not OFFLINE
        ERROR:          0x02,
        WARNING:        0x04,
        RUNNING:        0x08, // not OFFLINE, STOPPED, or PAUSED. helper flag.
        STOPPED:        0x10, // not RUNNING
        INIT:           0x12, // not RUNNING
        PAUSED:         0x14, // not RUNNING or STOPPED
        DETACHED:       0x18,
        //RESERVED:     ALL THESE FLAGS ARE YOURS, EXCEPT < 0x30
    };

    /**
     * @throws {module:plur/error/Interface}
     */
    constructor() {
        throw new InterfaceError({'this': this});
    };
}

PlurObject.plurify('plur/node/INode', IPlurNode, [ IConfigured, IEmittable ]);