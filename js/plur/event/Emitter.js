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
 * Provides publish-subscribe functionality for Event objects.
 *
 * Event types act as the topic, which are expected to be constructor namepaths followed by a . separated namespace.
 *   E.g., plur-test/plur/event/EmitterTest.testCreations.first
 *
 * Simple globbing of event types is possible when subscribing to a topic. The wildcard character * will match against
 * anything prefixed before its use, whole tokens only.
 *   E.g., example/Foo.* matches example/Foo.1, example/Foo.2, and example/Foo.bar.42. Does not match example/Food.1
 *
 * Subscribers are given a subscription id for each eventType pattern they wish to listen for, which they may be used
 * to unsubscribe from the emitter in the future. The once() method allows for a subscriber to automatically unsubscribe
 * after the first message is passed.
 *
 * @constructor plur/event/Emitter
 **
 */
var Emitter = function() {
    /* One or more subscribers toggle listening true. Vice versa.*/
	this._listening = false;
	/* Destroyed emitters are totally shutdown and cannot resume further operation. */
	this._destroyed = false;
	/* An index of subscription Ids currently listening. */
	this._subscriptionIds = {};
	/* Used for incrementally assigning subscription ids to new listeners. */
	this._subscriptionIdIndex = 0;
	/* Map with event type tokens (words split by . or /) organized as nested branches. Leaf objects with a key
	 * of > represent an array of Listeners subscribed to the containing branch. Leaf objects with a key of * (wildcard)
	 * represent an array of Listeners subscribed to any branch following the containing branch. Very basic globbing.

	 * @var plur/event/Emitter.this._listenerTree
	 */
	this._listenerTree = new Emitter._ListenerTreeNode();
	this._persistentEvents = {};
};

Emitter.prototype = PlurObject.create('plur/event/Emitter', Emitter);

/**
 * Listener entry for use in the listner tree.
 *
 * @constructor plur/event/Emitter._Listener
 **
 */
Emitter._Listener = function(eventType, callback, subscriptionId, temporary) {
	Assertion.assert(!this._destroyed, PlurStateError, 'Emitter has been destroyed');

    this.eventType = eventType;
    this.subscriptionId = subscriptionId;
    this.callback = callback;
    this.temporary = temporary;
};

/**
 * The Listener Tree stores every Event Type that is currently being subscribed to by representing each token of each
 * event type as a Tree Node. Each subsequent token of a given event type is created as a Child Node of the previous
 * token, and so on, chaining tokens together. Common event types share the same nodes where they initially match.
 *
 * Each node stores its own Listeners list as well as a list for Child Listeners that are subscribed to all children
 * of that node, rather than the node itself.
 *
 * Example:
 * car/wheel => {Node "car"} (parent) -> (child) {Node "wheel"}
 * car/trunk => {Node "car"} (parent) -> (child) {Node "trunk"}
 * the tree => {Node "car"} (parent) -> (children) [ {Node "wheel"] , {Node "trunk"} ]
 *
 * In the preceding example, a Listener for event type "car/wheel" would be stored in {Node: "wheel"}'s listeners
 * array, while a Wildcard Listener for event type "car/*" would be stored in {Node: "car"}'s childListeners array. The
 * former would only receive events for the exact event type of "car/wheel", while the latter listener would receive
 * events for both "car/wheel" and "car/trunk".
 *
 * @constructor plur/event/Emitter._ListenerTreeNode
 * @extends plur/design/tree/NamedNode
 **
 * @param plur/event/Emitter._ListenerTreeNode|undefined parent
 * @param string|undefined name
 */
Emitter._ListenerTreeNode = function(parent, name) {
    NamedTreeNode.call(this, parent, name);

    this.listeners = {}; // map: subscriptionId => listener
    this.childListeners = {}; // map: subscriptionId => listener
};

Emitter._ListenerTreeNode.prototype = PlurObject.create(
    'plur/event/Emitter._ListenerTreeNode', Emitter._ListenerTreeNode, NamedTreeNode);

Emitter._ListenerTreeNode.prototype.addListener = function(listener) {
    this.listeners[listener.subscriptionId] = listener;
};

Emitter._ListenerTreeNode.prototype.addChildListener = function(listener) {
    this.childListeners.push(listener);
};;

Emitter._ListenerTreeNode.prototype.removeListener = function(listener) {

};

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
            branch[token] = {'*': [], '>': []};
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

Emitter._findListeners = function(eventTypeTokens, listenerTree) {
    var listeners = [];

    // add all listeners of exactly that type
    var listenerBranch = this._getListenerBranch(eventTypeTokens);
    if (Array.isArray(listenerBranch[Emitter._listenersKey])) {
        listeners = listeners.concat(listenerBranch[Emitter._listenersKey]);
    }

    // add all listeners that are listening to type/*
    listenerBranch = this._getListenerBranch(eventTypeTokens);
    if (Array.isArray(listenerBranch[Emitter.wildcard])) {
        listeners = listeners.concat(listenerBranch[Emitter.wildcard]);
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
    var listener = new Emitter._Listener(eventType, callback, this._nextSubscriptionId(), temporary);
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

    this._subscriptionIds[listener.subscriptionId] = eventTypeTokens;

	return listener.subscriptionId;
};

Emitter.prototype._nextSubscriptionId = function() {
    for (var id = null; id !== null ; ) {
        id = ++this._subscriptionIdIndex;
        if (id < 0) {
            id = this._subscriptionIdIndex = 1;
        }

        if (typeof this._subscriptionIds[id] !== 'undefined') {
            id = null;
        }
    }

    return id;
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

    // ignore non-existant subscriptions
    if (typeof this._subscriptionIds[subscriptionId] === 'undefined') {
        return;
    }

    // use tokens to walk the tree
    var eventTypeTokens = this._subscriptionIds[subscriptionId];

	//delete the listener from the tree.
	var listenerBranch = this._getListenerBranch(eventTypeTokens);
	if (listenerBranch === null) {
	    throw Error('Listener branch missing.');
	}

    var found = false;
	for (var i = 0; !found && i < listenerBranch[Emitter.wildcard].length; ++i) {
	    if (listenerBranch[Emitter.wildcard][i].subscriptionId === subscriptionId) {
	        delete listenerBranch[Emitter.wildcard][i];
	        found = true;
	    }
	}

    // if not found, continue searching in listeners
	for (var i = 0; !found && i < listenerBranch[Emitter._listenersKey].length; ++i) {
	    if (listenerBranch[Emitter._listenersKey][i].subscriptionId === subscriptionId) {
	        delete listenerBranch[Emitter._listenersKey][i];
	    }
	}

	// prune childless tree nodes.
    while (this._listenerBranchEmpty(listenerBranch)) {
        if (listenerBranch !== this._listenerTree) {
            delete listenerBranch;
            listenerBranch = this._getListenerBranch(eventTypeTokens, eventTypeTokens.length - 2);
        } else {
            break;
        }
    }

    if (this._listenerBranchEmpty(this._listenerTree)) {
        this._listening = false;
    }
};

Emitter.prototype._listenerBranchEmpty = function(listenerBranch) {
    if (listenerBranch[Emitter._listenerKey].length > 1) {
        return false;
    } else if (listenerBranch[Emitter.wildcard].length > 1) {
        return false;
    }

    for (var key in listenerBranch) {
        if (key !== Emitter.wildcard && key !== Emitter._listenerKey) {
            return false;
        }
    }

    return true;
};

Emitter.prototype._getListenerBranch = function(eventTypeTokens, branchIndex) {
	var listenerBranch = this._listenerTree;
    for (var i = 0, n = (branchIndex ? branchIndex+1 : eventTypeTokens.length); i < n; ++i) {
        if (typeof listenerBranch[eventTypeTokens[i]] !== 'object') {
            return null;
        }

        listenerBranch = listenerBranch[eventTypeTokens[i]];
    }

    return listenerBranch;
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
	for (var i = 0, n = listeners.length; i < n; ++i) {
		var listener = listeners[i];

        // once()
		if (listener.temporary) {
		    // unsubscribe before callback
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
	this._subscriptionIds = {};
	this._subscriptionIdIndex = 0;
};

return Emitter;
});

