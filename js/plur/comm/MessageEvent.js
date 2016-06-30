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
 * Universal message envelope for all inter-node and intra-node communications.
 * Works with both normal emitters and comm/Channel.
 *
 * @constructor plur/msg/AMessageEvent
 **
 * @param {plur/msg/IMessage} message Unencrypted. Will not be stored if encryptFunction is available.
 * @param {string} encryptedMessage This will be transmitted instead of the unencrypted message contents.
 * @param {string} encryptedNextKey Provided for use with Symmetric ciphers.
 */
var MessageEvent = function(message, encryptedMessage, encryptedNextKey) {
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
        this._encryptedNextKey = encryptedNextKey;
    } else {
        this._encrypted = false;
        this._message = message;
        this._encryptedNextKey = null;
    }

    this._hash = Hash.get().hash(this._message);
};

 //* @param {Function():=string encrypted|undefined} encryptFunction Returns an encrypted copy of IMessage, no parameters passed.
MessageEvent.createEncrypted = function(message, encryptFunction, modelTransformer, encryptNextKeyFunction) {
    var dataEncryptionPromise = null;
    var keyEncryptionPromise = null;
    var encryptedModel = null;
    var encryptedNextKey;

    if (typeof encryptNextKeyFunction === 'function') {
        keyEncryptionPromise = new PlurPromise(function(resolve, reject) {
            encryptNextKeyFunction().then(function(encryptedData) {
                encryptedNextKey = encryptedData;
                resolve();
            });
        });
    } else {
        keyEncryptionPromise = new PlurPromise(PlurPromise.noop);
    }

    dataEncryptionPromise = new PlurPromise(function(resolve, reject) {
        encryptFunction(modelTransformer).then(function(encryptedData) {
            encryptedModel = encryptedData;
            resolve());
        });
    });

    var promise = new PlurPromise(function(resolve, reject) {
        PlurPromise.all([keyEncryptionPromise, dataEncryptionPromise]).then(function() {
            resolve(new MessageEvent(message, encryptedModel, encryptedNextKey));
        });
    });

    return promise;
};

new MessageEvent(message, encryptedData
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
