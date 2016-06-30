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

AService._Private = function(service) {
    this.cipherKeyMap = new PromiseMap(); // PGP => Keypair
    this.sessionKeyMap = new PromiseMap(); // <PGP Public Key Hash> => Keyset
    this.emitter = new Emitter();
};

AService.prototype = PlurObject.create('plur/service/AService._Private', AService._Private);

AService.prototype.generateKeys = function(cipher) {
    var promise = new PlurPromise(function(resolve, reject) {
        Crypt.get(cipher).then(function(crypt) {
            generateKeys().then(function(keys) {
                resolve(keys);
            });
        });
    });

    __cipherKeyMap.put(cipher, promise);
    return promise;
};

AService.prototype.encryptData = function(cipher, key, data) {
    var promise = new PlurPromise(function(resolve, reject) {
        Crypt.get(cipher).then(function(crypt) {
            if (!__cipherKeyMap.has(cipher)) {
                generateKeys(cipher);
            }

            __cipherKeyMap.get(cipher).then(function(keyset) {
                crypt.encrypt(key, keyset, data).then(function(encryptedData) {
                    resolve(encryptedData);
                });
            });
        });
    });

    return promise;
};

	        decryptData: function(cipher, key, data) {
	            return Crypt.get().decrypt(keys.getPrivateKey(), publicKey, data);
	        },

	        createEncryptModelCallback: function(model) {
	            return function(cipher, key, modelTransformer) {
	                return encryptData(cipher, key, modelTransformer.encode(model));
	            };
	        },

	        createEncryptNextKeyCallback: function() {
	            return function(cipher, publicKey);
	        },

	        decryptModel: function(cipher, publicKey, data, modelTransformer) {
	            return modelTransformer.decode(__private.decryptData(cipher, publicKey, data));
	        }

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
    var subscriptionId = comm.on([
        'plur/msg/Notification.to.' + this._servicePubKeyHash,
        'plur/msg/Request.to.' + this._servicePubKeyHash,
        'plur/msg/Response.to.' + this._servicePubKeyHash ],
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