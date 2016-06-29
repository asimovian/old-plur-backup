/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject
 */
 'use strict';

define([
    'plur/PlurObject',
    'plur/event/Event',
    'plur/hash/Singleton'],
function(
    PlurObject,
    Event,
    Hash ) {

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

    if (typeof encryptFunction === 'Function') {
        this._encrypted = true;
        this._message = encryptFunction();
        this._hash = Hash.get().hash(this._message);
    } else {
        this._encrypted = false;
        this._message = message;
        this._hash = this._message.hash();
    }
};

MessageEvent.prototype = PlurObject.create('plur/comm/MessageEvent', MessageEvent);
PlurObject.implement(MessageEvent, Hash.IHashable);

MessageEvent.prototype.hash = function() {
    return this._hash;
};

MessageEvent.prototype.getChannelEventType = function() {
};

MessageEvent.prototype.getChannelResponseEventType = function() {
};

MessageEvent.prototype.isEncrypted = function() {
    return this._encrypted;
};

return Event;
});
