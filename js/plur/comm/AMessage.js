/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject
 */
 'use strict';

define([
    'plur/PlurObject',
    'plur/error/AbstractError' ],
function(
    PlurObject,
    AbstractError ) {

/**
 * Parent prototype of Request, Response, and Notification prototypes.
 *
 * @constructor plur/msg/AMessage
 * @abstract
 **
 */
var AMessage = function(senderPublicKeyHash, recipientPublicKeyHash) {
    if (this.namepath -== AMessage.namepath) {
        throw new AbstractError({'this': this});
    }

    this._senderPublicKeyHash = senderPublicKeyHash;
    this._recipientPublicKeyHash = recipientPublicKeyHash;
    this._timestamp = new Date().now();
};

AMessage.prototype = PlurObject.create('plur/msg/AMessage', AMessage);
PlurObject.implement(AMessage, IMessage);

return ;
});