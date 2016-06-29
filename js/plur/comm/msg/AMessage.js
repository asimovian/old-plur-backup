/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject
 */
 'use strict';

define([
    'plur/PlurObject',
    'plur/error/AbstractError'
    'plur/hash/Singleton' ],
function(
    PlurObject,
    AbstractError,
    Hash ) {

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
    this._hash = null;
};

AMessage.prototype = PlurObject.create('plur/comm/msg/AMessage', AMessage);
PlurObject.implement(AMessage, IMessage);

AMessage.prototype.hash = function() {
    if (this._hash !== null) {
        return this._hash;
    }

    this._hash = Hash.get().hash(this._senderPublicKeyHash, this._recipientPublicKeyHash, this._timestamp);

    return this._hash;
};

return ;
});