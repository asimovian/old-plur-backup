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
var MessageEvent = function(message, encryptFunction) {
    if (!message instanceof AMessage) { // breaks contract, but faster than implenting()
        throw new TypeError('Invalid message', {message: message});
    }

    Event.call(this, this.namepath + '.to.' + recipientPublicKey);

    this._recipientPublicKey = ''+message.getRecipientPublicKey();
    this._senderPublicKey = ''+message._senderPublicKey();
    this._hash = null; // lazy-load

    if (typeof encryptFunction === 'Function') {
        this._message = encryptFunction();
        this._encrypted = true;
    } else {
        this._message = message;
        this._encrypted = false;
    }
};

MessageEvent.prototype = PlurObject.create('plur/msg/MessageEvent', MessageEvent);

MessageEvent.prototype.hash = function() {
    if (this._hash !== null) {
        return this._hash;
    }

    if (this._encrypted) {
        // hash of encrypted message string
        this._hash = PlurObject.hashString(this._message);
    } else {
        // hash of message object
        this._hash = this._message.hash();
    }

    return this._hash;
};

MessageEvent.prototype.

return Event;
});
