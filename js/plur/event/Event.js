/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @deprecated
 * @requires plur/PlurObject
 */
'use strict';

define([
    'plur/PlurObject' ],
function(
    PlurObject ) {

/**
 * Basic Event
 *
 * @constructor plur/event/Event
 * @extends plur/PlurObject
 **
 * @param string type
 * @param {} data
 */
var Event = function(type, data) {
	this._type = type;
	this._data = ( data || {} );
	this._timestamp = new Date().getTime();
};

Event.prototype = PlurObject.create('plur/event/Event', Event);

/**
 * Retrieves the event type.
 *
 * @returns string type
 */
Event.prototype.getType = function() {
    return this._type;
};

/**
 * Retrieves additional data concerning the event.
 *
 * @returns {} data
 */
Event.prototype.getData = function() {
    return this._data;
};

/**
 * Retrieves the timestamp of when the event was first emitted.
 *
 * @returns int timestamp
 */
Event.prototype.getTimestamp = function() {
    return this._timestamp;
};

return Event;
});