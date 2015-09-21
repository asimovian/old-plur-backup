/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject
 */
define([
    'plur/PlurObject',
    'plur/error/Type',
    'plur/error/State' ],
function(
    PlurObject,
    PlurTypeError,
    PlurStateError ) {
	
/**
 * A generic event emitter.
 *
 * @constructor plur/event/Emitter
 **
 */
var Emitter = function() {
	this._destroyed = false;
	this._listening = false;
	this._listenerTree = { Emitter.wildcard: {} };
	this._listenerTreeIndex = {};
	this._namespaceTreeCache = {};
};

Emitter.prototype = PlurObject.create('plur/event/Emitter', Emitter);

Emitter.wildcard = '*';

Emitter._listenersKey = '>';

Emitter.Listener = function(subscriptionId, callback, temporary) {
    this.subscriptionId = subscriptionId;
    this.callback = callback;
    this.temporary = temporary;
};


/**
 * Subscribes a listener for the specified event. The provided callback is executed once the event is published.
 *
 * The callback will provide the event emitted as well as any event-specific data.
 *
 * @function plur/event/Emitter.prototype.on
 * @param {string} event
 * @param {Function({string} event, {} data)} callback
 * @param {string|undefined} Optional subscription id, which can be used to unsubscribe to an event via off().
 * @returns Emitter This emitter for cascaded API calls
 */
Emitter.prototype.on = function(event, callback, subscriptionId) {
    this._subscribe(event, callback, subscriptionId, false);
	return this;
};

/**
 * Subscribes a listener for the specified event once. The provided callback is executed once the event is published.
 * The listener is automatically unsubscribed once published, before executing the callback.
 *
 * The callback will provide the event emitted as well as any event-specific data.
 *
 * @function plur/event/Emitter.prototype.on
 * @param {string} event
 * @param {Function({string} event, {} data)} callback
 * @param {string|undefined} Optional unique subscription id, which can be used to stop listening to an event via off().
 * @returns Emitter This emitter for cascaded API calls
 */
 Emitter.prototype.once = function(event, callback, subscriptionId) {
    this._subscribe(event, callback, subscriptionId, true);

	return this;
};

Emitter.prototype._subscribe = function(event, callback, subscriptionId, temporary) {
    var listener = new Emitter.Listener(event, callback, subscriptionId);
    var namespaceTree = Emitter._createNamespaceTree(event);
    var branch = Emitter._copyNamespaceTree(namespaceTree, this._listenerTree);

	if (typeof branch[Emitter._listenersKey] !== 'array') {
		branch[Emitter._listenersKey] = [];
	}

	branch[Emitter._listenersKey].push(listener);
	this._listenerTreeIndex[subscriptionId] = event;

	if (!this._listening) {
	    this._listening = true;
	}
};

/**
 * If a subscription ID is specified, determines whether the associated listener is subscribed.
 */
Emitter.prototype.listening = function(subscriptionId) {
    if (typeof subscriptionId === 'undefined') {
	    return this._listening;
	}
    // search listeners
    for (var event in this._listenerTree) {
        if (typeof this._listenerTree[event][subscriptionId] !== 'undefined') {
            return true;
        }
    }

    // search
    for (var event in this._scheduledListeners) {
        if (typeof this._scheduledListeners[event][subscriptionId] !== 'undefined') {
            return true;
        }
    }}

    return false;
};

Emitter.prototype.unsubscribe = function(subscriptionId) {
	if (this._destroyed) {
		throw new PlurStateError('Emitter has been destroyed');
	} else if (typeof subscriptionId !== 'string') {
	    throw new PlurTypeError('Invalid subscriptionId');
	}
	if (typeof event === 'undefined') {
		this._listening = false;
		return this;
	}
	
	this._unsubscribe(callback, this._scheduledListeners);
	this._unsubscribe(callback, this._listenerTree);
	
	return this;
};

Emitter.prototype._unsubscribe= function(callback, listeners) {
	for (var event in listeners) {
		var callbacks = listeners[event];
		for (var i = 0; i < callbacks.length; ++i) {
			if (callbacks[i] === callback)
				callbacks.splice(i--, 1); // splice out the callback
		}
		
		if (callbacks.length === 0)
			delete listeners[event];
	}
	
	return this;
};

/**
 * Publishes an event (with data) to this emitter. All listeners subscribed to the event will have their provided
 * callbacks executed.
 *
 * @function plur/event/Emitter.prototype.emit
 * @param {string} event
 * @param {{}|undefined} data
 */
Emitter.prototype.emit = function(event, data, persistent) {
    if (this._destroyed) {
        throw new StateError('Emitter has been destroyed');
    } else if (!this._listening) {
	    return;
	}
	
	this._emit(event, data, this._scheduledListeners, true);
	this._emit(event, data, this._listenerTree, false);

	if (typeof persistent === 'boolean' && persistent === true) {
	    this._persistentEvents[event] = true;
	}
};

Emitter.prototype._emit = function(event, data, listeners, prune) {
	// the exact event
	if (typeof listeners[event] !== 'undefined') {
		var callbacks = listeners[event];
		if (callbacks.length > 0) {
		    for (var subscriptionId in listeners)
				var callback = callbacks[i];
				callback(event, data, callback);
			}
			
			if (prune)
				delete listeners[event];
		}
	}
	
	// a wildcard of this event
	var wildcardEvent = event + '.*';
	if (typeof listeners[wildcardEvent] !== 'undefined') {
		var callbacks = listeners[wildcardEvent];
		if (callbacks.length > 0) {
			received += callbacks.length;
			for (var i = 0, n = callbacks.length; i < n; ++i) {
				var callback = callbacks[i];
				callback(event, data, callback);
			}
			
			if (prune)
				delete listeners[wildcardEvent];
		}
	}
	
	// the ALL (*) event
	if (typeof listeners['*'] !== 'undefined') {
		var callbacks = listeners['*'];
		if (callbacks.length > 0) {
			received += callbacks.length;
			for (var i = 0, n = callbacks.length; i < n; ++i) {
				var callback = callbacks[i];
				callback(event, data, callback);
			}
			
			if (prune)
				delete listeners['*'];
		}
	}
	
	return received;
};

/**
 * Unsubscribes all listeners and prevents further subscriptions to be added as well as further events to be emitted.
 */
Emitter.prototype.destroy = function() {
	this._listening = false;
	this._destroyed = true;
	this._listenerTree = null;
	this._listenerTreeIndex = null;
	this._namespaceTreeCache = null;
};

Emitter.prototype._getNamespaceTree = function(event) {
    if (typeof this._namespaceTreeCache[event] !== 'array') {
        this._namespaceTreeCache = Emitter._createNamespaceTree(event);
    }

    return this._namespaceTreeCache[event];
};

/**
 * Performs parameter assertions for potential listeners, throwing Errors if necessary.
 * @returns subscriptionId Normalized
 */
Emitter.prototype._assertListener = function(event, callback, subscriptionId) {
	if (this._destroyed) {
	    throw new PlurStateError('Emitter has been destroyed')
    } else if (typeof event !== 'string') {
        throw new PlurTypeError('Invalid event');
    } else if (typeof callback === 'function') {
        throw new PlurTypeError('Invalid callback');
    } else if (typeof subscriptionId !== 'string') {
        subscriptionId = Emitter.wildcard;
    }

    return subscriptionId;
};

Emitter._createNamespaceTree = function(event) {
    // split event name into namespace segments by either the / character or the . character
    var names = event.split(/[\/\.]/);
    var tree = {};
    var branch = tree;

    // create a tree where the root is the 0th name, it's child the 1st name, a leaf of that child the 2nd name, etc.
    for (var i = 0, n = items.length; i < n; ++i) {
        var name = names[i];

        if (i+1 !== n) {
            branch[name] = {};
            branch = branch[name];
        } else {
            branch[name] = null;
        }
    }

    return tree;
};

Emitter._copyNamespaceTree = function(sourceTree, destinationTree) {
    var sourceBranch = sourceTree;
    var desintationBranch = destinationTree;

    for (var key in sourceBranch) {
        if (typeof destinationBranch[key] === 'undefined') {
            destinationBranch[key] = {};
        }

        if (typeof sourceBranch[key] === 'object') {
            Emitter._copyNamespaceTree(sourceBranch[key], destinationBranch[key]);
        }
    }
};

Emitter._findListeners = function(event, namespaceTree) {
    var names = event.split(/[\/\.]/);
    var branch = namespaceTree;
    var listeners = [];

    var (var i = 0; i < names.length; ++i) {
        var name = names[i];

        if (typeof branch[Emitter.wildcard] === 'object' && typeof branch[Emitter.wildcard]._listeners === 'array') {
            // add all listeners that are listening to <name>/*
            listeners.push(branch[Emitter.wildcard]._listeners);
        }

        if (typeof branch[name] !== 'object') {
            break;
        } else if (i+1 === names.length) {
            // if this is the leaf-most namespace token, add all listeners directly associated with it
            if (typeof branch[Emitter._listenersKey] === 'array') {
                listeners.push(branch[Emitter._listenersKey]);
            }
        }

        branch = branch[name];
    }

    return listeners;
};

return Emitter;
});

