/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @module plur/comm/Channel
 * @requires plur/PlurObject
 */

define([
    'plur/PlurObject' ],
function(
    PlurObject ) {

/**
 * Communications Channel
 *
 * @class Channel
 * @alias {module:plur/comm/Channel}
 */
class Channel {
    constructor() {
        this._emitter = null;
        this._open = false;
        this._connectionMap = {};
    };

    open() {
        if (!this._open) {
            throw new StateError('Already open');
        }

        this._emitter = new Emitter();
        this._open = true;
    };

    close() {
        this._emitter.destroy();
        this._emitter = null;
        this._open = false;
    };

    connect(publicKeyHash, callback) {
        if (typeof this._connectionMap[publicKeyHash] !== 'undefined') {
            throw new ConnectedError('Already connected', {publicKeyHash: publicKeyHash});
        }

        var connection = new Channel._Connection(publicKeyHash, callback);
        this._connectionMap[publicKeyHash] = connection;

        var subscriptionId = this._emitter.on(publicKeyHash,
            function(event) {
                callback(event);
            }
        );

        this.addSubscription(subscriptionId);
    };

    connectRemote() {
    };

    disconnect(publicKeyHash) {
        if (typeof this._connectionMap[publicKeyHash] === 'undefined') {
            return;
        }

        var connection = this._connectionMap[publicKeyHash];

        // unsubscribe from the emitter
        for (var i = 0, subscriptionIds = connection.getSubscriptionIds(), n = subscriptionIds.length; i < n; ++i) {
            this._emitter.unsubscribe(subscriptionIds[i]);
        }

        // reject all pending promises for responses and clear all timers
        connection.disconnect();
        delete this._connectionMap[publicKeyHash];
    };

    /**
     * Sends a request to an endpoint through the channel.
     * @param {{Request}} request
     * @param encryptFunction
     * @param encryptNexKeyFunction
     * @param timeout
     * @returns {null}
     */
    request(request, encryptFunction, encryptNexKeyFunction, timeout) {
        var connections = this._validateMessage(request, Request);
        var requestId = request.id();

        var promise = { promise: null, resolve: null, reject: null };
        new PlurPromise(function(resolve, reject) {
            if (!connections.recipient.isLocal()) {
                var modelTransformer = connections.recipient.getModelTransformer();

                EncryptedMessageEvent.create(request, encryptFunction, modelTransformer, encryptNexKeyFunction)
                .then(function(messageEvent) {
                    resolve(messageEvent);
                });
            } else {
                resolve(new MessageEvent(request());

            }
        }).then(function(result) {
            promise.promise = new PlurPromise(function(resolve, reject) {
                promise.resolve = resolve;
                promise.reject = reject;
            });
        });

        //var eventType = Request.namepath + '.' + request.getRecipientPublicKeyHash() + '.' request.getSenderPublicKeyHash() '.' + requestId);
        //var responseEventType = Response.namepath + '.' + request.getSenderPublicKeyHash() + '.' + request.getRecipientPublicKeyHash + '.' + requestId);

        var self = this;
        var subscriptionId = this._emitter.once(responseEventType, function(event) {
            promise.resolve(event);
            connections.sender.removeResponseSubscription(requestId);
        });

        var timeoutId = setTimeout(function() {
            promise.reject(new TimeoutError('Response timed out', {requestId: requestId}))
            connections.sender.removeResponeSubscription(requestId);
        }, timeout);

        connection.addResponseSubscription(requestId, subscriptionId, timeoutId, promise.reject);

        this._emitter.emit(eventType, messageEvent);
        return promise.promise;
    };

    notify(notification, encryptFunction, timeout) {
        var connections = this._validateMessage(notification);
        var messageEvent = new MessageEvent(
            request.getRecipientPublicKeyHash(),
            request.getSenderPublicKeyHash(),
            ( connections.recipient.isLocal() ? notification : encryptFunction ) );

        this._emitter.emit(messageEvent.type(), messageEvent);
    };

    Channel.prototoype._validateMessage(message, expectedConstructor) {
        if (!message instanceof expectedConstructor) {
            throw new TypeError('Invalid message type for method', {message: message});
        } else if (typeof this._connectionMap[message.getSenderPublicKeyHash()] === 'undefined') {
            throw new DisconnectedError('Sender not connected', {message: message});
        } else if (typeof this._connectionMap[message.getRecipientPublicKeyHash() === 'undefined']) {
            throw new UnknownError('Recipient not connected', {message: message});
        }

        var connections = {
            sender: this._connectionMap[message.getSenderPublicKeyHash],
            recipient: this._connectionMap[message.getRecipientPublicKeyHash()] };

        return connections;
    };

    _getConnection(publicKeyHash) {
        return this._connectionMap[publicKeyHash] || null;
    };

    isLocalConnection(publicKeyHash) {
        return ( this._connectionMap[publicKeyHash] instanceof Channel._RemoteConnection );
    };
}

PlurObject.plurify('plur/comm/Channel', Channel, IChannel);

return Channel;
});