/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 */
define([
	'plur/PlurObject',
	'plur/event/Emitter'
	'plur/crypt/CryptSingleton' ],
function(
    PlurObject,
    Emitter,
    Crypt ) {



var AService = function(plurNode, config) {
	if (typeof plurNode === 'undefined') {
		throw new Error('PlurNode not specified for new: ' + this.namepath);
    }

	this._plurNode = plurNode;
	this._config = AService.DEFAULT_CONFIG.merge(config);
    this._running = false;
	this._emitter = new Emitter();
	this._nodeEmitterSubscriptionIds = [];

    var __private = new AService._Private(this);

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



/** Generic Events **/

AService.StartEvent = function(service) {
    this.service = service;
};

AService.StartEvent.prototype = PlurObject.create('plur/service/AService.StartEvent', AService.StartEvent);

AService.prototype = PlurObject.create('plur/service/AService', AService);

AService.StopEvent = function(service) {
    this.service = service;
};

AService.StopEvent.prototype = PlurObject.create('plur/service/AService.StopEvent', AService.StopEvent);

/** **/

AService.prototype = PlurObject.create('plur/service/AService', AService);
PlurObject.implement(Service, IEmitterProvider);
PlurObject.implement(Service, ICryptoConsumer);

AService.prototype.publicKey = function() {
    return this.__publicKey();
};

AService.prototype.publicKeyHash = function() {
    return this.__publicKeyHash();
};

AService.prototype.start = function() {
	if (this.running()) {
	    throw new RunningError({'this': this});
    } else if (this._emitter === null) {
        throw new DestroyedError({'this': this});
    }

    var __private = (function() {
        return {
            cryptSession: new CryptSession();
            emitter: new Emitter();
        };
    })();

    this._running = true;
    this.__startPrivateEmitter();

	// generic announce to entire node
	var startEvent = new AService.StartEvent(this);
	this._plurNode.emitter().emit(startEvent);
	this._emitter.emit(startEvent);
	var subscriptionId = this._emitter.once(PlurNode.ShutdownEvent, function(shutdownEvent) {
	    this.stop();
	});

	this._nodeEmitterSubscriptionIds.push(subscriptionId);

};

AService.prototype.stop = function() {
	if (!this.running()) {
        throw new NotRunningError({'this': this});
    }

    this._running = false;

    var comm = this._plurNode.comm();
    for (var i = 0, n = this._nodeCommSubscriptionIds.length; i < n; ++i) {
        comm.unsubscribe(this._nodeCommSubscriptionIds[i]) ;
    }

    var emitter = this._plurNode.emitter();
    for (var i = 0, n = this._nodeEmitterSubscriptionIds.length; i < n; ++i) {
        emitter.unsubscribe(this._nodeEmitterSubscriptionIds[i]) ;
    }

    // broadcoast service stop
    var stopEvent = new Service.StopEvent(this);
	this._emitter.emit(stopEvent);
	this._plurNode.emitter().emit(stopEvent);

    // destroy object thoroughly
	this._emitter.destroy();
	this._emitter = null;
	this.__destroyPrivate();
};

AService.prototype.running = function() {
	return this._running;
};

AService.prototype.emitter = function() {
    if (!this._running) {
        throw new NotRunningError({'this': this});
    }

	return this._emitter;
};

AService.prototype.getPlurNode = function() {
	return this._plurNode;
};

AService.prototype._startPrivateEmitter = function(__private) {
    if (this.running()) {
        return;
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

    this._nodeCommSubscriptionIds.push(subscriptionId);

    var msg = new NoopNotification(this);
	comm.notify(msg, __private.encryptModelCallback(msg), __private.encryptNextKeyCallback());
};

return AService;
});