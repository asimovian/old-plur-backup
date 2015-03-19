define(['plur/PlurObject'], function(PlurObject) {
	
/**
 * A generic event emitter.
 */
var Emitter = function() {
	this.__online = true;
	this.__destroyed = false;
	this.__debugging = false;
	this.__eventCallbackMap = {};
	this.__eventScheduledCallbackMap = {};
};

Emitter.prototype = PlurObject.create('plur/event/Emitter', Emitter);

Emitter.prototype.on = function(event, callback) {
	if (this.__destroyed)
		return this;
	if (typeof event === 'undefined') { // turn entire emitter offline
		this.__online = true;
		return this;
	}
	
	if (typeof this.__eventCallbackMap[event] === 'undefined')
		this.__eventCallbackMap[event] = [];
	
	this.__eventCallbackMap[event].push(callback);
	return this;
};

Emitter.prototype.once = function(event, callback) {
	if (this.__destroyed)
		return this;
	if (typeof this.__eventScheduledCallbackMap[event] === 'undefined')
		this.__eventScheduledCallbackMap[event] = [];
	
	this.__eventScheduledCallbackMap[event].push(callback);
	return this;
};

Emitter.prototype.online = function() {
	return this.__online;
};

Emitter.prototype.off = function(callback) {
	if (this.__destroyed)
		return this;
	if (typeof event === 'undefined') {
		this.__online = false;
		return this;
	}
	
	this._off(callback, this.__eventScheduledCallbackMap);
	this._off(callback, this.__eventCallbackMap);
	
	return this;
};

Emitter.prototype._off = function(callback, callbackMap) {
	for (var event in callbackMap) {
		var callbacks = callbackMap[event];
		for (var i = 0; i < callbacks.length; ++i) {
			if (callbacks[i] === callback)
				callbacks.splice(i--, 1); // splice out the callback
		}
		
		if (callbacks.length === 0)
			delete callbackMap[event];
	}
	
	return this;
};

/**
 * @returns int received The amount of callbacks that were called. -1 if the emitter is currently offline.
 */
Emitter.prototype.emit = function(event, data) {
	if (!this.__online)
		return -1;
	
	if (this.__debugging)
		console.log('[dbg] Emit: ' + event + ' : ', data);
	
	var received = this._emit(event, data, this.__eventScheduledCallbackMap, true);
	received += this._emit(event, data, this.__eventCallbackMap, false);
	return received;
};

Emitter.prototype._emit = function(event, data, callbackMap, prune) {
	prune = ( typeof prune === 'undefined' ? false : prune );
	var received = 0;
	// the exact event
	if (typeof callbackMap[event] !== 'undefined') {
		var callbacks = callbackMap[event];
		if (callbacks.length > 0) {
			received += callbacks.length;
			for (var i = 0, n = callbacks.length; i < n; ++i) {
				var callback = callbacks[i];
				callback(event, data, callback);
			}
			
			if (prune)
				delete callbackMap[event];
		}
	}
	
	// a wildcard of this event
	var wildcardEvent = event + '.*';
	if (typeof callbackMap[wildcardEvent] !== 'undefined') {
		var callbacks = callbackMap[wildcardEvent];
		if (callbacks.length > 0) {
			received += callbacks.length;
			for (var i = 0, n = callbacks.length; i < n; ++i) {
				var callback = callbacks[i];
				callback(event, data, callback);
			}
			
			if (prune)
				delete callbackMap[wildcardEvent];
		}
	}
	
	// the ALL (*) event
	if (typeof callbackMap['*'] !== 'undefined') {
		var callbacks = callbackMap['*'];
		if (callbacks.length > 0) {
			received += callbacks.length;
			for (var i = 0, n = callbacks.length; i < n; ++i) {
				var callback = callbacks[i];
				callback(event, data, callback);
			}
			
			if (prune)
				delete callbackMap['*'];
		}
	}
	
	return received;
};

Emitter.prototype.destroy = function() {
	this.__online = false;
	this.__destroyed = true;
	this.__eventCallbackMap = null;
	this.__eventScheduledCallbackMap = null;
};

Emitter.prototype.debug = function(debugging) {
	this.__debugging = ( typeof debugging === 'undefined' ? true : debugging );
};

return Emitter;
});

