/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject
 */
 'use strict';
 
define([
    'plur/PlurObject',
    'plur/hash/Hash'],
function(
    PlurObject,
    Hash) {

/**
 * Encrypted Channel Event
 *
 * @constructor plur/comm/event/encrypted/Channel
 **
 */
var EncryptedChannelEvent = function(recipientPublicKeyHash, senderPublicKeyHash, encryptedMessageEvent, nextChannelEncryptionKey) {
    ChannelEvent.call(this, recipientPublicKeyHash, senderPublicKeyHash, null);

    this._encryptedMessageEvent = encryptedMessageEvent;
    this._encryptedMessageEventHash = Hash.get().sha3(this._encryptedMessageEvent);
    this._nextChannelEncryptionKey = nextChannelEncryptionKey;
};

EncryptedChannelEvent.prototype = PlurObject.create('plur/comm/event/encrypted/Channel', EncryptedChannelEvent, ChannelEvent);

EncryptedTransmissionEvent.create = function() {
};

return EncryptedChannelEvent;
});