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



var Service = function(plurNode, options) {
	if (typeof plurNode === 'undefined') {
		throw Error('PlurNode not specified for new: ' + this.namepath);
    }

	options = ( typeof options === 'undefined' ? {} : options );

    this._running = false;
	this._emitter = new Emitter();
	this._plurNode = plurNode;
	this._servicePubKeyHash = '234j234asdf'; //TODO
	this._autoStart = ( typeof options.autostart === 'undefined' ? true : options.autostart );
	this._nodeEmitterSubscriptionIds = [];

	// Maintain a private key and a private emitter for each
	var __private = (function() {
	    return {
	        keys: Crypt.get().generateKeys();

	        encrypt: function(publicKey, data) {
	            return Crypt.get().encrypt(keys.getPrivateKey(), publicKey, data);
	        };

	        decrypt: function(publicKey, data) {
	            return Crypt.get().decryptObject(keys.getPrivateKey(), publicKey, data);
	        };
	    };
	})();

	this.__publicKey = function() { return __private.keys.getPublicKey(); };

	this.__startPrivateEmitter = function() {
	    this._startPrivateEmitter(__private);
   	};
};

/** Generic Events **/

Service.StartEvent = function(service) {
    this.data.serviceNamepath = service.namepath;
};

Service.StartEvent.prototype = PlurObject.create('plur/service/Service.StartEvent', Service.StartEvent);

Service.prototype = PlurObject.create('plur/service/Service', Service);

Service.StopEvent = function(service) {
    this.data.serviceNamepath = service.namepath;
};

Service.StopEvent.prototype = PlurObject.create('plur/service/Service.StopEvent', Service.StopEvent);

/** **/

Service.prototype = PlurObject.create('plur/service/Service', Service);
PlurObject.implement(Service, IEmitterProvider);
PlurObject.implement(Service, ICryptoConsumer);

Service.prototype.publicKey = function() {
    return this.__publicKey();
};


Service.prototype.start = function() {
	if (this.running()) {
		return;
    }

    this._running = true;

    this.__startPrivateEmitter();

	// generic announce to entire node
	var startEvent = new Service.StartEvent(this);
	this._plurNode.emitter().emit(startEvent);
	this._emitter.emit(startEvent);
};

Service.prototype.stop = function() {
	if (!this.running()) {
		return;
    }

    this._running = false;

    var stopEvent = new Service.StopEvent(this);
	this._emitter.emit(stopEvent);
	this._plurNode
	this._emitter.destroy();
};

Service.prototype.running = function() {
	return this._running;
};

Service.prototype.emitter = function() {
	return this._emitter;
};

Service.prototype.getPlurNode = function() {
	return this._plurNode;
};

Service.prototype._startPrivateEmitter = function(__private) {
		if (this.running()) {
			return;
		}

		var subscriptionId = this._plurNode.comm().on([
    		'plur/msg/Notification.to.' + this._servicePubKeyHash,
    		'plur/msg/Request.to.' + this._servicePubKeyHash,
    		'plur/msg/Response.to.' + this._servicePubKeyHash ],
    		function(encryptedEvent) {
    		    if (!PlurObject.implements(encryptedEvent, IMessage)) {
    		        return;
    		    }

    		    var event = __private.decryptObject(event.data.getSenderPublicKey(), event.data.getContents())
    			 __private.emitter().emit(event.type, event.data);
    		}
    	);

	    this._nodeEmitterSubscriptionIds.push(subscriptionId);

    	__private.emitter.on('plur/msg/')

return Service;
});