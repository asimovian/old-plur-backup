/**
 * @copyright 2017 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @module plur/service/event/Start
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
 * @class ServiceStartEvent
 * @alias {module:plur/service/event/Start}
 */
class ServiceStartEvent extends AEvent {
    constructor(service) {
        super(this.namepath, service)
        this.service = service;
    };
}

PlurObject.plurify('plur/service/event/Start', ServiceStartEvent);

return ServiceStartEvent;
});