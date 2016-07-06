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
 * Channel Event
 *
 * @constructor plur/comm/event/Channel
 **
 */
var ChannelEvent = function(recipientPublicKeyHash, senderPublicKeyHash, messageEvent) {
    AEvent.call(this);

    if (messageEvent !== null && messageEvent instanceof MessageEvent) {
        throw new TypeError('Invalid message event.', {messageEvent: messageEvent})
    }

    this._recipientPublicKeyHash = recipientPublicKeyHash;
    this._senderPublicKeyHash = senderPublicKeyHash;
    this._messageEvent = messageEvent;
};

ChannelEvent.prototype = PlurObject.create('plur/comm/event/Channel', ChannelEvent, AEvent);

return ChannelEvent;
});