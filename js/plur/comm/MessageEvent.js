/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject
 */
 'use strict';

define([
    'plur/PlurObject',
    'plur/event/Event' ],
function(
    PlurObject,
    Event ) {

/**
 * Request Event
 *
 * @constructor plur/msg/AMessageEvent
 **
 * @param string
 * @param plur/msg/IMessage
 * @param {}|undefined data
 */
var MessageEvent = function(recipientPublicKey, message, data) {
    if (!message instanceof AMessage) { // breaks contract, but faster than implenting()
        throw new TypeError('Invalid message', {message: message});
    }

    Event.call(this, this.namepath + '.to.' + recipientPublicKey, data);

    this._recipientPublicKey = recipientPublicKey;
    this._message = message;
};

MessageEvent.prototype = PlurObject.create('plur/msg/MessageEvent', MessageEvent);

return Event;
});
