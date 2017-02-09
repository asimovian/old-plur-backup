/**
 * @copyright 2017 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 */
define([
	'plur/PlurObject',
    'plur/service/IService',
	'plur/event/Emitter',
    'plur/node/Node',
	'plur/crypt/CryptSingleton',
    'plur/node/event/Shutdown',
    'plur/service/event/Start',
    'plur/service/event/Stop' ],
function(
    PlurObject,
    IService,
    Emitter,
    PlurNode,
    Crypt,
    PlurNodeShutdownEvent,
    ServiceStartEvent,
    ServiceStopEvent ) {

/**
 * Basic implementation of an IService.
 */
class AService {
    constructor(plurNode, config) {
        if (typeof plurNode === 'undefined') {
            throw new Error('PlurNode not specified for new: ' + this.namepath);
        }

        this._status = IService.Status.OFFLINE;
        this._plurNode = plurNode;
        this._config = AService.DEFAULT_CONFIG.merge(config);
        this._emitter = new Emitter();
        this._emitterSubscriptions = [];

        let __private = (function() { return {
            cryptSession: new CryptSession(),
            emitter: new Emitter()
        }})();

        this.__publicKey = function() { return __private.getPublicKey(); };
        this.__publicKeyHash = function() { return __private.getPublicKeyHash(); };

        this.__startPrivateEmitter = function() {
            this._startPrivateEmitter(__private);
        };

        this.__destroyPrivate = function() {
            __private.emitter.destroy();
            __private.emitter = null;
            __private.keys = null;
        };
    };

    _preStart = function() {
        // make sure that the service isn't already running and that it hasn't ran before
        if (this.running()) {
            throw new RunningError({'this': this});
        } else if (this._emitter === null) {
            throw new DestroyedError({'this': this});
        }

        this._status = IService.Status.ONLINE | IService.Status.INIT;

        this.__startPrivateEmitter();

        // subscribe to a shutdown event from the plur node. stop on receipt.
        let subscriptionId = this._emitter.once(PlurNodeShutdownEvent, function (shutdownEvent) {
            this.stop();
        });

        // register the shutdown event subscription so that it may be retracted on shutdown
        this._subscribedToEmitter(this._emitter, subscriptionId);
    };

    _postStart() {
        this._status = IService.Status.ONLINE | IService.Status.RUNNING;

        // broadcast the service start event
        let startEvent = new ServiceStartEvent(this);
        this._plurNode.emitter().emit(startEvent); // broadcast to the node
        this._emitter.emit(startEvent); // broadcast to the service
    };

    _subscribedToEmitter(emitter, subscriptionId) {
        this._emitterSubscriptions.push([emitter, subscriptionId]); // store as a pair: 0: emitter, 1: subscription id
    };

    _unsubscribeFromAllEmitters() {
        for (let i = 0, n = this._emitterSubscriptions.length; i < n; ++i) {
            let [ emitter, subscriptionId ] = this._emitterSubscriptions[i];
            emitter.unsubscribe(subscriptionId);
        }
    };

    _setStatus(on, off) {
        if (typeof on !== 'undefined') {
            this._status |= on;
        }
        if (typeof off !== 'undefined') {
            this._status &= off;
        }
    };

    status() {
        return this._status;
    };

    running() {
        return this._status & ( IService.Status.ONLINE | IService.Status.RUNNING );
    };

    _preStop() {
        // check to see if we're already stopped
        if (!this.running()) {
            throw new NotRunningError({'this': this});
        }

        this._setStatus(IService.Status.STOPPED, ~IService.Status.RUNNING);
    };

    _postStop() {
        // check to see if we're already stopped
        if (!this.running()) {
            throw new NotRunningError({'this': this});
        }

        this._setStatus(IService.Status.OFFLINE, ~IService.Status.ONLINE);

        // broadcast service stop
        let stopEvent = new ServiceStopEvent(this);
        this._emitter.emit(stopEvent);
        this._plurNode.emitter().emit(stopEvent);

        // destroy object thoroughly
        this._emitter.destroy();
        this._emitter = null;
        this.__destroyPrivate();
    };

    emitter() {
        if (!this._running) {
            throw new NotRunningError({'this': this});
        }

        return this._emitter;
    };

    getPlurNode = function() {
        return this._plurNode;
    };

    _startPrivateEmitter(__private) {
        if (this.running()) {
            throw new NotRunningError({'this': this});
        }

        var comm = this._plurNode.comm();
        var subscriptionId = comm.on(this.publicKeyHash(),
            function(messageEvent) {
                if (!PlurObject.implementing(messageEvent, IMessage)) {
                    return;
                }

                if (messageEvent.isEncrypted()) {
                    var connection = comm.getConnection(messageEvent.getSenderPublicKeyHash());
                    var message = __private.decryptModel(
                        connection.getPublicKey(),
                        messageEvent.getMessage(),
                        connection.getTransformer()
                    );

                    if (typeof message.__NEXTKEY !== 'undefined') {
                        __private.cryptSession.setNextSessionKey(messageEvent.__NEXTKEY);
                        delete messageEvent.__NEXTKEY;
                    }

                    messageEvent = new MessageEvent(message);
                }

                __private.emitter().emit(messageEvent);
            }
        );

        // record the message event subscription for later withdrawl
        this._subscribedToEmitter(comm, subscriptionId);

        var msg = new NoopNotification(this);
        comm.notify(msg, __private.encryptModelCallback(msg), __private.encryptNextKeyCallback());
    };

    publicKey() {
        return this.__publicKey();
    };

    publicKeyHash = function() {
        return this.__publicKeyHash();
    };
}

PlurObject.plurify('plur/service/AService', AService, [ IService, IEmitterProvider, ICryptoConsumer ]);

return AService;
});