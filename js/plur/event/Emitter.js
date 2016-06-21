/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject
 */
define([
    'plur/PlurObject',
    'plur/error/Assertion',
    'plur/error/Type',
    'plur/error/State' ],
function(
    PlurObject,
    Assertion,
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
	this._listenerTree = {};
	this._listenerTreeIndex = {};
	this._namespaceTreeCache = {};
	this._persistentEvents = {};
};

Emitter.prototype = PlurObject.create('plur/event/Emitter', Emitter);

/**
 * @constructor plur/event/Emitter._Listener
 **
 */
Emitter._Listener = function(callback, subscriptionId, temporary) {
	Assertion.assert(!this._destroyed, PlurStateError, 'Emitter has been destroyed');
	Assertion.assert(typeof event === 'string', PlurTypeError, 'Invalid event');
	Assertion.assert(typeof callback === 'function', PlurTypeError, 'Invalid callback')

    this.subscriptionId = ( typeof subscriptionId === 'string' ? subscriptionId : Emitter.wildcard );
    this.callback = callback;
    this.temporary = temporary;
};

Emitter.wildcard = '*';

Emitter._listenersKey = '>';

Emitter._splitEventKeys = function(event) {
    return event.split(/[\/\.]/);
};

Emitter._createNamespaceTree = function(event) {
    // split event name into namespace segments by either the / character or the . character
    var names = ( typeof event !== 'string' ? event : Emitter._splitEventKeys(event) );
    var tree = {};
    var branch = tree;

    // create a tree where the root is the 0th name, it's child the 1st name, a leaf of that child the 2nd name, etc.
    for (var i = 0, n = names.length; i < n; ++i) {
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
    var destinationBranch = destinationTree;

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
    var names = Emitter._splitEventKeys(event);
    var branch = namespaceTree;
    var listeners = [];

    for (var i = 0; i < names.length; ++i) {
        var name = names[i];

        if (typeof branch[Emitter.wildcard] === 'object' && typeof branch[Emitter.wildcard]._listeners === 'array') {
            // add all listeners that are listening to <name>/*
            listeners = listeners.concat(branch[Emitter.wildcard]._listeners);
        }

        if (typeof branch[name] !== 'object') {
            break;
        } else if (i+1 === names.length) {
            // if this is the leaf-most namespace token, add all listeners directly associated with it
            if (typeof branch[name][Emitter._listenersKey] === 'object') {
                listeners = listeners.concat(branch[name][Emitter._listenersKey]);
            }
        }

        branch = branch[name];
    }

    return listeners;
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
    var listener = new Emitter._Listener(callback, subscriptionId, temporary);
    var eventKeys = Emitter._splitEventKeys(event);
    var namespaceTree = Emitter._createNamespaceTree(eventKeys);

    Emitter._copyNamespaceTree(namespaceTree, this._listenerTree);

    // iterate down namespace tree and add the listener as the last leaf child
    var branch = this._listenerTree;
    for (var i = 0; i < eventKeys.length; ++i) {
        branch = branch[eventKeys[i]];
    }

	if (typeof branch[Emitter._listenersKey] !== 'array') {
		branch[Emitter._listenersKey] = [];
	}

	branch[Emitter._listenersKey].push(listener);
	this._listenerTreeIndex[listener.subscriptionId] = event;

	if (!this._listening) {
	    this._listening = true;
	}
};

/**
 * If a subscription ID is specified, determines whether the associated listener is subscribed.
 */
Emitter.prototype.listening = function() {
	return this._listening;
};

Emitter.prototype.unsubscribe = function(subscriptionId) {
	Assertion.assert(!this._destroyed, PlurStateError, 'Emitter has been destroyed')
	Assertion.assert(typeof subscriptionId === 'string', PlurTypeError, 'Invalid subscription ID')

	if (typeof event === 'undefined') {
		this._listening = false;
		return this;
	}
	
	this._unsubscribe(callback, this._scheduled_Listeners);
	this._unsubscribe(callback, this._listenerTree);
	
	return this;
};

Emitter.prototype._unsubscribe = function(callback, listeners) {
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
	Assertion.assert(!this._destroyed, PlurStateError, 'Emitter has been destroyed')

    if (!this._listening) {
	    return;
	}

	var namespaceTree = this._getNamespaceTree(event);
	var listeners = Emitter._findListeners(event, this._listenerTree);

	for (var i = 0; i < listeners.length; ++i) {
		var listener = listeners[i];

		if (listener.temporary) {
			this.unsubscribe(listener.subscriptionId);
		}

		listener.callback(event, data);
	}
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
        this._namespaceTreeCache[event] = Emitter._createNamespaceTree(event);
    }

    return this._namespaceTreeCache[event];
};



return Emitter;
});

