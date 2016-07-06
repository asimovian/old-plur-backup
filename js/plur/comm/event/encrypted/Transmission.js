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
 * Encrypted Transmission Event
 *
 * @constructor plur/comm/event/encrypted/Transmission
 **
 */
var EncryptedTransmissionEvent = function(recipientWebsocketPublicKeyHash, senderWebsocketPublicKeyHash, encryptedChannelEvent, nextTransmissionEncryptionKey) {
    TransmissionEvent.call(this, recipientWebsocketPublicKeyHash, senderWebsocketPublicKeyHash, null);

    this._encryptedChannelEvent = encryptedChannelEvent;
    this._encryptedChannelEventHash = Hash.get().sha3(this._encryptedChannelEvent);
    this._nextTransmissionEncryptionKey = nextTransmissionEncryptionKey;
};

EncryptedTransmissionEvent.prototype = PlurObject.create('plur/comm/event/encrypted/Transmission', EncryptedTransmissionEvent, TransmissionEvent);

EncryptedTransmissionEvent.create = function() {
};

return EncryptedTransmissionEvent;
});