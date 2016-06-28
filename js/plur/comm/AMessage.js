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
 * Parent prototype of Request, Response, and Notification prototypes.
 *
 * @constructor plur/msg/AMessage
 * @abstract
 **
 */
var AMessage = function(senderPublicKeyHash, recipientPublicKeyHash) {
    this._senderPublicKeyHash = senderPublicKeyHash;
    this._recipientPublicKeyHash = recipientPublicKeyHash;
    this._timestamp = new Date().now();
};

AMessage.prototype = PlurObject.create('plur/msg/AMessage', AMessage);
PlurObject.implement(AMessage, IMessage);

return ;
});