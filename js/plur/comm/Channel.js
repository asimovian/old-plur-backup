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
 * Communications Channel
 *
 * @constructor plur/comm/Channel
 **
 */
var Channel = function() {
    this._emitter = null;
    this._open = false;
};

Channel.prototype = PlurObject.create('plur/comm/Channel', Channel);

Channel.prototype.open = function() {
    if (!this._open) {
        throw new StateError('Already open');
    }

    this._emitter = new Emitter();
    this._open = true;
};

Channel.prototype.close = function() {
    this._emitter.destroy();
    this._emitter = null;
    this._open = false;
};

Channel.prototype.connect = function(publicKeyHash, callback, isRemote) {
    var subscriptionId = this._emitter.on([
        Request.namepath + '.' + publicKeyHash + '.*',
        Notify.namepath + '.' + publicKeyHash + '.*' ],
        function(event) {
            callback(event);
        }
    });

    var connection = new Channel._Connection(publicKeyHash, callback, isRemote);
    connection.addSubscription(subscriptionId);
    this._connectionMap[publicKeyHash] = connection;
};

Channel.prototype.disconnect = function(publicKeyHash) {
};

Channel.prototype.request = function(request, encryptFunction, timeout) {
    if (!request instanceof Request) {
        throw new TypeError('Invalid request', {request: request});
    }

    var promiseReject = null;
    var promiseResolve = null;
    var promise = new PlurPromise(function(resolve, reject) {
        promiseResolve = resolve;
        promiseReject = reject;
    });

    var messageEvent = null;
    if (!this.isLocalConnection(request.getRecipientPublicKeyHash()) {
        messageEvent = new MessageEvent(request.getRecipientPublicKeyHash(), request.getSenderPublicKeyHash(), request.encryptFunction());
    } else {
        messageEvent = new MessageEvent(request.getRecipientPublicKeyHash(), request.getSenderPublicKeyHash(), request);
    }

    var eventType = Request.namepath + '.' + request.getRecipientPublicKeyHash() + '.' request.getSenderPublicKeyHash() '.' + request.hash());
    var responseEventType = Response.namepath + '.' + request.getSenderPublicKeyHash() + '.' + request.getRecipientPublicKeyHash + '.' + request.hash();


    var self = this;
    var timeoutId = null;
    var subscriptionId = this._emitter.once(responseEventType, function(event) {
        promiseResolve(event);
        clearTimout(timeoutId);
    });

    timeoutId = setTimeout(function() {
        promiseReject(new TimeoutError('Response timed out', {requestId: request.hash()}))
        self._emitter.unsubscribe(subscriptionId);
    }, timeout);


    this._emitter.emit(eventType, request);
};

Channel.prototype._getConnection = function(publicKeyHash) {
    return this._connectionMap[publicKeyHash] || null;
};

Channel.prototype.isLocalConnection = function(publicKeyHash) {
    return ( this._connectionMap[publicKeyHash] instanceof Channel._RemoteConnection );
};

return Channel;
});