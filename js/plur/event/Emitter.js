/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject
 */
define([
    'plur/PlurObject',
    'plur/error/Assertion',
    'plur/error/Type',
    'plur/error/State',
    'plur/event/Event' ],
function(
    PlurObject,
    Assertion,
    PlurTypeError,
    PlurStateError,
    Event ) {
	
/**
 * A generic event emitter.
 *
 * @constructor plur/event/Emitter
 **
 */
var Emitter = function() {
	this._listening = false;
	this._destroyed = false;
	this._listenerTree = {};
	this._persistentEvents = {};
};

Emitter.prototype = PlurObject.create('plur/event/Emitter', Emitter);

/**
 * @constructor plur/event/Emitter._Listener
 **
 */
Emitter._Listener = function(eventType, callback, temporary) {
	Assertion.assert(!this._destroyed, PlurStateError, 'Emitter has been destroyed');
	Assertion.assert(typeof event === 'string', PlurTypeError, 'Invalid event');
	Assertion.assert(typeof callback === 'function', PlurTypeError, 'Invalid callback')

    this.eventType = eventType;
    this.subscriptionId =  ++Emitter._Listener._subscriptionIdIndex;
    this.callback = callback;
    this.temporary = temporary;
};

Emitter._Listener._subscriptionIdIndex = 0;

Emitter.wildcard = '*';

Emitter._listenersKey = '>';

Emitter._tokenizeEventType = function(eventType) {
    return eventType.split(/[\/\.]/);
};

Emitter._createEventTypeTokenTree = function(eventType) {
    // split event name into namespace segments by either the / character or the . character
    var tokens = ( typeof eventType !== 'string' ? eventType : Emitter._tokenizeEventType(eventType) );
    var tree = {};
    var branch = tree;

    // create a tree where the root is the 0th name, it's child the 1st name, a leaf of that child the 2nd name, etc.
    for (var i = 0, n = tokens.length; i < n; ++i) {
        var token = tokens[i];

        if (i+1 !== n) {
            branch[token] = {};
            branch = branch[token];
        } else {
            branch[token] = null;
        }
    }

    return tree;
};

Emitter._copyEventTypeTokenTree = function(sourceTree, destinationTree) {
    var sourceBranch = sourceTree;
    var destinationBranch = destinationTree;

    for (var key in sourceBranch) {
        if (typeof destinationBranch[key] === 'undefined') {
            destinationBranch[key] = {};
        }

        if (typeof sourceBranch[key] === 'object') {
            Emitter._copyEventTypeTokenTree(sourceBranch[key], destinationBranch[key]);
        }
    }
};

Emitter._findListeners = function(eventType, listenerTree) {
    var eventTypeTokens = Emitter._tokenizeEventType(eventType);
    var listenerBranch = listenerTree;
    var listeners = [];

    for (var i = 0; i < eventTypeTokens.length; ++i) {
        var eventTypeToken = eventTypeTokens[i];

        if (typeof listenerBranch[eventTypeToken] !== 'object') { // path not found
            break;
        }

        listenerBranch = listenerBranch[eventTypeToken];

        if (i+1 === eventTypeTokens.length) { // last token, grab exact subscribers for this branch
            // if this is the leaf-most namespace token, add all listeners directly associated with it
            if (Array.isArray(listenerBranch[Emitter._listenersKey])) {
                listeners = listeners.concat(listenerBranch[Emitter._listenersKey]);
            }
        } else if (i+2 === eventTypeTokens.length) { // second to last token, grab wildcard subscribers for this branch
            if (typeof listenerBranch[Emitter.wildcard] === 'object' && Array.isArray(listenerBranch[Emitter.wildcard][Emitter._listenersKey])) {
                // add all listeners that are listening to <name>/*
                listeners = listeners.concat(listenerBranch[Emitter.wildcard][Emitter._listenersKey]);
            }
        }

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
 * @returns int subscriptionId for use with unsubscribe()
 */
Emitter.prototype.on = function(eventType, callback) {
    return this._subscribe(eventType, callback, false);
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
 * @returns int subscriptionId for use with unsubscribe()
 */
 Emitter.prototype.once = function(eventType, callback) {
    return this._subscribe(eventType, callback, true);
};

Emitter.prototype._subscribe = function(eventType, callback, temporary) {
    var listener = new Emitter._Listener(eventType, callback, temporary);
    var eventTypeTokens = Emitter._tokenizeEventType(eventType);
    var eventTypeTokenTree = Emitter._createEventTypeTokenTree(eventTypeTokens);

    Emitter._copyEventTypeTokenTree(eventTypeTokenTree, this._listenerTree);

    // iterate down namespace tree and add the listener as the last leaf child
    var branch = this._listenerTree;
    for (var i = 0; i < eventTypeTokens.length; ++i) {
        branch = branch[eventTypeTokens[i]];
    }

	if (typeof branch[Emitter._listenersKey] !== 'array') {
		branch[Emitter._listenersKey] = [];
	}

	branch[Emitter._listenersKey].push(listener);

	if (!this._listening) {
	    this._listening = true;
	}

	return listener.subscriptionId;
};

/**
 * If a subscription ID is specified, determines whether the associated listener is subscribed.
 *
 * @function plur/event/Emitter.prototype.listening
 * @returns boolean isListening TRUE if listening, FALSE if not.
 */
Emitter.prototype.listening = function() {
	return this._listening;
};

/**
 * Unsubscribes a listener from this emitter by subscriptionId previously returned by on() or once().
 *
 * @function plur/event/Emitter.prototype.unsubscribe
 * @param int subscriptionId
 */
Emitter.prototype.unsubscribe = function(subscriptionId) {
	Assertion.assert(!this._destroyed, PlurStateError, 'Emitter has been destroyed')
	Assertion.assert(typeof subscriptionId === 'string', PlurTypeError, 'Invalid subscription ID')

	this._unsubscribe(callback, this._listenerTree);
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
};

/**
 * Publishes an event (with data) to this emitter. All listeners subscribed to the event will have their provided
 * callbacks executed.
 *
 ** Callback
 * function callback(plur/Event/Event event)
 **
 * @function plur/event/Emitter.prototype.emit
 * @param {string} event
 * @param {{}|undefined} data
 */
Emitter.prototype.emit = function(eventType, eventData, persistent) {
	Assertion.assert(!this._destroyed, PlurStateError, 'Emitter has been destroyed')

    if (!this._listening) {
	    return;
	}

	// build event
	var event = new Event(eventType, eventData);

	// find listeners for event type
	var listeners = Emitter._findListeners(eventType, this._listenerTree);
	for (var i = 0; i < listeners.length; ++i) {
		var listener = listeners[i];

		if (listener.temporary) {
			this.unsubscribe(listener.subscriptionId);
		}

		listener.callback(event);
	}
};

/**
 * Unsubscribes all listeners and prevents further subscriptions to be added as well as further events to be emitted.
 */
Emitter.prototype.destroy = function() {
	this._listening = false;
	this._destroyed = true;
	this._listenerTree = null;
};

return Emitter;
});

