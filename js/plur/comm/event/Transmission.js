/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject
 */
 'use strict';
 
define([
    'plur/PlurObject',
    'plur/event/AEvent' ],
function(
    PlurObject,
    AEvent ) {

/**
 * Transmission Event
 *
 * @constructor plur/comm/event/Transmission
 **
 */
var TransmissionEvent = function(recipientWebsocketPublicKeyHash, senderWebsocketPublicKeyHash, channelEvent) {
    AEvent.call(this);

    if (channelEvent !== null && !channelEvent instanceof ChannelEvent) {
        throw new TypeError('Invalid Channel Event.', {channelEvent: channelEvent});
    }

    this._recipientWebsocketPublicKeyHash = recipientWebsocketPublicKeyHash;
    this._senderWebsocketPublicKeyHash = senderWebsocketPublicKeyHash;
    this._channelEvent = channelEvent;
};

TransmissionEvent.prototype = PlurObject.create('plur/comm/event/Transmission', TransmissionEvent, AEvent);

return TransmissionEvent;
});