/**
 * @copyright 2017 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @module plur/service/event/Stop
 * @requires plur/PlurObject
 */
'use strict';

define([
    'plur/PlurObject',
    'plur/event/AEvent' ],
function(
    PlurObject,
    AEvent ) {

/**
 * Published when a new IService starts.
 * 
 * @class ServiceStopEvent
 * @alias {module:plur/service/event/Stop}
 */
class ServiceStopEvent extends AEvent {
    constructor(service) {
        super(this.namepath, service)
        this.service = service;
    };
}

PlurObject.plurify('plur/service/event/Stop', ServiceStopEvent);

return ServiceStopEvent;
});