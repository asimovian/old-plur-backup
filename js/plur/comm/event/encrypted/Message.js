/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject
 */
 'use strict';
 
define([
    'plur/PlurObject' ],
function(
    PlurObject ) {

/**
 * Encrypted Message Event
 *
 * @constructor plur/comm/event/ecnrypted/Message
 **
 */
var EncryptedMessageEvent = function(recipientPublicKeyHash, senderPublicKeyHash, encryptedMessage, nextMessageEventEncryptionKey) {
    MessageEvent.call(this, recipientPublicKeyHash, senderPublicKeyHash, null);

    this._encryptedMessage = encryptedMessage;
    this._encryptedMessageHash = Hash.get().sha3(this._encryptedMessage);
    this._nextMessageEventEncryptionKey nextMessageEventEncryptionKey;
};

EncryptedMessageEvent.prototype = PlurObject.create('plur/comm/event/ecnrypted/Message', EncryptedMessageEvent);

//* @param {Function():=string encrypted|undefined} encryptFunction Returns an encrypted copy of IMessage, no parameters passed.
EncryptedMessageEvent.create = function(message, encryptFunction, modelTransformer, encryptNextKeyFunction) {
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
            resolve(new EncryptedMessageEvent(message, encryptedModel, encryptedNextKey));
        });
    });

    return promise;
};

EncryptedMessageEvent.prototype.getMessageEvent = function() {
    throw new EncryptedError('Message Event is encrypted.');
};

EncryptedMessageEvent.prototype.getEncryptedMessageEvent = function() {
    return this._encryptedMessageEvent;
};

EncryptedMessageEvent.prototype.getEncryptedMessageEventHash = function() {
    return this._encryptedMessageEventHash;
};

MessageEvent.prototype.hash = function() {
    return this._hash;
};



return EncryptedMessageEvent;
});