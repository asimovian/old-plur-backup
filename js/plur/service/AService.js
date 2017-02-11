/**
 * @copyright 2017 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @module plur/service/AService
 */
define([
	'plur/PlurObject',
    'plur/service/IService',
	'plur/event/Emitter',
    'plur/node/Node',
	'plur/crypt/CryptSingleton',
    'plur/crypt/Session',
    'plur/node/event/Shutdown',
    'plur/service/event/Start',
    'plur/service/event/Stop' ],
function(
    PlurObject,
    IService,
    Emitter,
    PlurNode,
    Crypt,
    CryptSession,
    PlurNodeShutdownEvent,
    ServiceStartEvent,
    ServiceStopEvent ) {

//TODO: Refactor out remaining code to CryptoSession and rely on that.

/**
 * Standard IService implementation that is registered with and actively runs on a PlurNode.
 * Publishes service-specific events via the emitter().
 * Internally connected to the node's encrypted CommChannel and may communicate with any other IService - local or remote.
 * Maintains an active CryptSession for use with CommChannel, identity, and verification.
 * Identified by a SHA3 hash of its public key.
 * Public keys are provided by the CryptSession and are NOT permanent - they rotate often.
 */
class AService {
    constructor(plurNode, config) {
        if (typeof plurNode === 'undefined') {
            throw new Error('PlurNode not specified for new: ' + this.namepath);
        }

        this._status = IService.Status.OFFLINE;
        this._plurNode = plurNode;
        this._config = AService.getDefaultConfig().merge(config);
        this._emitter = new Emitter();
        this._emitterSubscriptions = [];

        let __private = new _Private(this);

        this._publicKey = function() { return __private.cryptSession.getPublicKey(); };
        this._publicKeyHash = function() { return __private.cryptSession.getPublicKeyHash(); };
        this._startPrivate = function() { __private.start(); };
        this._destroyPrivate = function() { __private.destroy(); }; // force gc
    };

    _preStart = function() {
        // make sure that the service isn't already running and that it hasn't ran before
        if (this.running()) {
            throw new RunningError({'this': this});
        } else if (this._emitter === null) {
            throw new DestroyedError({'this': this});
        }

        this._status = IService.Status.ONLINE | IService.Status.INIT;

        this._initPrivate();

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

        // gc the emitter
        this._emitter.destroy();
        this._emitter = null;
        this._destroyPrivate();
    };

    emitter() {
        if (!this._running) {
            throw new NotRunningError({'this': this});
        }

        return this._emitter;
    };

    plurNode = function() {
        return this._plurNode;
    };

    publicKey() {
        return this.__publicKey();
    };

    publicKeyHash = function() {
        return this.__publicKeyHash();
    };
}

PlurObject.plurify('plur/service/AService', AService, [ IService, IEmitterProvider, ICryptoConsumer ]);

class _Private {
    /**
     * @param AService self
     */
    constructor(self) {
        this.self = self;
        this.privateEmitter = new Emitter();
        this.cryptSession = new CryptSession();
    };

    start() {
        if (this.self.running()) {
            throw new NotRunningError({'this': this.self});
        }

        let comm = this.self.plurNode().comm();
        let subscriptionId = comm.on(this.self.publicKeyHash(),
            function(messageEvent) {
                if (!PlurObject.implementing(messageEvent, IMessage)) {
                    return;
                }

                if (messageEvent.isEncrypted()) {
                    let connection = comm.getConnection(messageEvent.getSenderPublicKeyHash());
                    let message = this.cryptSession.decryptModel(
                        connection.getPublicKey(),
                        messageEvent.getMessage(),
                        connection.getTransformer()
                    );

                    if (typeof message.__NEXTKEY !== 'undefined') {
                        this.cryptSession.setNextSessionKey(messageEvent.__NEXTKEY);
                        delete messageEvent.__NEXTKEY;
                    }

                    messageEvent = new MessageEvent(message);
                }

                this.privateEmitter.emit(messageEvent);
            }
        );

        // record the message event subscription for later withdrawl
        this.self._subscribedToEmitter(comm, subscriptionId);

        let msg = new NoopNotification(this);
        comm.notify(msg, __private.encryptModelCallback(msg), __private.encryptNextKeyCallback());
    };

    destroy() { // trigger gc
        this.privateEmitter.destroy();
        this.privateEmitter = null;
        this.self = null;
        this.cryptSession = null;
    };
}

return AService;
});