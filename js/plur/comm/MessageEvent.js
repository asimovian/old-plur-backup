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
 * @param {string} encryptedMessage This will be transmitted instead of the unencrypted message contents.
 */
var MessageEvent = function(message, encryptedMessage) {
    Event.call(this);

    if (!message instanceof AMessage) { // breaks contract, but faster than implenting()
        throw new TypeError('Invalid message', {message: message});
    } else if (typeof encryptedMessage !== 'undefined' && typeof encryptedMessage !== 'string') {
        throw new TypeError('Encrypted message is not a string', {encryptedMessage: encryptedMessage});
    }

    this._timestamp = message.getTimestamp(); // override
    this._recipientPublicKeyHash = message.getRecipientPublicKeyHash();
    this._senderPublicKeyHash = message.getSenderPublicKeyHash();
    this._channelEventType = null;
    this._channelResponseEventType = null;

    if (typeof encryptedMessage !== 'undefined') {
        this._encrypted = true;
        this._message = encryptedMessage;
    } else {
        this._encrypted = false;
        this._message = message;
    }

    this._hash = Hash.get().hash(this._message);
};

 //* @param {Function():=string encrypted|undefined} encryptFunction Returns an encrypted copy of IMessage, no parameters passed.
MessageEvent.createEncrypted = function(message, encryptFunction, modelTransformer) {
    var promise = new PlurPromise(function(resolve, reject) {
        encryptFunction(modelTransformer).then(function(encryptedData) {
            resolve(new MessageEvent(message, encryptedData));
        });
    });

    return promise;
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
