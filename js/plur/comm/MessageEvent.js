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

MessageEvent.prototype.createEnvelope = function() {
    var envelope = new Envelope(this);
    return envelope;
};

var Envelope = function(messageEvent) {
    this._encryptedCryptMeta = '';
    this._encryptedMessage =  messageEvent.getMessage();
    this._encryptedMessageEvent = '';

};

Envelope.fromData = function(data) {
    var pos = 0;
    for (var i = 0, pos = -1; i < 3; ++i) {
        pos = data.indexOf('.', ++pos);
        if (pos === -1) {
            throw new InvalidError('Invalid envelope data.', {data: data});
        }
    }

    var index = data.slice(pos++); // pos is now pointing at the first real data character
    index = index.split('.');
    if (index.length !== 3) {
        throw new InvalidError('Invalid envelope data.', {data: data});
    }

    var encryptedCryptMeta = data.slice(pos, pos+index[0]);
    pos += index[0];
    if (encryptedCryptMeta.length !== index[0]) {
        throw new InvalidError('Invalid envelope data.', {data: data});
    }

    var encryptedMessageEvent = data.slice(pos, pos+index[1]);
    pos += index[1];
    if (encryptedMessageEvent.length !== index[1]) {
        throw new InvalidError('Invalid envelope data.', {data: data});
    }

    var encryptedMessage = data.slice(pos, pos+index[2]);
    pos += index[2];
    if (encryptedMessage.length !== index[2]) {
        throw new InvalidError('Invalid envelope data.', {data: data});
    }

    return new Envelope(encryptedCryptMeta, encryptedMessageEvent, encryptedMessage);
};

Envelope.prototype.getSizeIndex = function() {
    var index = this._encryptedCryptMeta.length
        + '.' + this._encryptedMessageEvent.length
        + '.' + this._encryptedMessage.length;

    return index;
};

Envelope.prototype.getData = function() {
    return this.getSizeIndex() + this._encryptedCryptMeta + this._encryptedMessageEvent + this._encryptedMessage;
};

return Event;
});
