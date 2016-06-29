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
 * An event composed of an IMessage, which may be encrypted.
 * Works with both normal emitters and comm/Channel.
 *
 * @constructor plur/msg/AMessageEvent
 **
 * @param {plur/msg/IMessage} message Unencrypted. Will not be stored if encryptFunction is available.
 * @param {Function():=string encrypted|undefined} encryptFunction Returns an encrypted copy of IMessage, no parameters passed.
 */
var MessageEvent = function(message, encryptFunction) {
    if (!message instanceof AMessage) { // breaks contract, but faster than implenting()
        throw new TypeError('Invalid message', {message: message});
    }

    Event.call(this, this.namepath + '.to.' + recipientPublicKey);

    this._recipientPublicKey = message.getRecipientPublicKey();
    this._senderPublicKey = message.getSenderPublicKey();
    this._channelEventType = '';
    this._channelResponseEventType = null;
    this._hash = null; // lazy-load


    if (typeof encryptFunction === 'Function') {
        this._message = encryptFunction();
        this._encrypted = true;
    } else {
        this._message = message;
        this._encrypted = false;
    }

    if (this._encrypted) {
        // hash of encrypted message string
        this._hash = PlurObject.hashString(this._message);
    } else {
        // hash of message object
        this._hash = this._message.hash();
    }

};

MessageEvent.prototype = PlurObject.create('plur/msg/MessageEvent', MessageEvent);

MessageEvent.prototype.hash = function() {
    return this._hash;
};


MessageEvent.prototype.getChannelEventType = function() {

};

MessageEvent.prototype.getChannelResponseEventType = function() {

};

return Event;
});
