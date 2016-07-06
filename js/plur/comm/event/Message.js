/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject
 */
 'use strict';

define([
    'plur/PlurObject',
    'plur/event/AEvent',
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
var MessageEvent = function(recipientPublicKeyHash, senderPublicKeyHash, message) {
    AEvent.call(this);

    if (message !== null && !PlurObject.implementing(message, IMessage)) {
        throw new TypeError('Invalid message', {message: message});
    }

    this._recipientPublicKeyHash = recipientPublicKeyHash;
    this._senderPublicKeyHash = senderPublicKeyHash;
    this._message = message;
};

MessageEvent.prototype = PlurObject.create('plur/comm/MessageEvent', MessageEvent, AEvent);

return Event;
});
