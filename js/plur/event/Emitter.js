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
	this._subscriptionTreeMap = {};
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
    this.childListeners[listener.subscriptionId] = listener;
};;

Emitter._ListenerTreeNode.prototype.removeListener = function(subscriptionId) {
    delete this.listeners[listner.subscriptionId];
    delete this.childListeners[listner.subscriptionId];
};

Emitter._ListenerTreeNode.prototype.empty = function() {
    return ( NamedTreeNode.prototype.empty.call(this)
        && Object.keys(this.listeners).length === 0 && Object.keys(this.childListeners) === 0);
};

Emitter.wildcard = '*';

Emitter._listenersKey = '>';

Emitter._tokenizeEventType = function(eventType) {
    return eventType.split(/[\/\.]/);
};

Emitter._ListenerTreeNode.prototype.appendTree = function(eventTypeTokens) {
    var branch = this;

    // create a tree where the root is the 0th name, it's child the 1st name, a leaf of that child the 2nd name, etc.
    for (var i = 0, n = tokens.length; i < n; ++i) {
        var token = tokens[i];

        if (branch.name() === token) {
            continue;
        } else if (branch.hasChild(token)) {
            branch = branch.child(token);
        } else {
            branch = branch.addChild(new Emitter._ListenerTreeNode(branch, token));
        }
    }

    return branch;
};

Emitter.prototype_findListeners = function(eventTypeTokens) {
    var listeners = [];
    var branch = this._listenerTree;

    for (var i = 0, n = eventTypeTokens.length; i < n; ++i) {
        var token = eventTypeTokens[i];
        var branch = branch.child(eventTypeTokens[i]);
        if (branch === null) {
            break;
        }

        if (i+1 === n) { // last node, get exact listeners
            listeners = listeners.concat(branch.getListeners());
        } else { // preceding node, get child listeners
            listeners = listeners.concat(branch.getChildListeners());
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
    var listener = new Emitter._Listener(eventType, callback, this._nextSubscriptionId(), temporary);
    var eventTypeTokens = Emitter._tokenizeEventType(eventType);
    var branch = this._listenerTree.appendTree(eventTypeTokens);

	if (!this._listening) {
	    this._listening = true;
	}

    this._subscriptionTreeMap[listener.subscriptionId] = branch;

	return listener.subscriptionId;
};

Emitter.prototype._nextSubscriptionId = function() {
    for (var id = null; id !== null ; ) {
        id = ++this._subscriptionIdIndex;
        if (id < 0) {
            id = this._subscriptionIdIndex = 1;
        }

        if (typeof this._subscriptionTreeMap[id] !== 'undefined') {
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
    if (typeof this._subscriptionTreeMap[subscriptionId] === 'undefined') {
        return;
    }

	//delete the listener from the tree.
	var listenerBranch = this._subscriptionTreeMap[subscriptionId];
	AssertionError.assert(listenerBranch !== null, 'Listener branch is missing.')

    listenerBranch.removeListener(subscriptionId);

	// prune childless tree nodes.
    while (!listenerBranch().isRoot() && listenerBranch.empty()) {
        var child = listenerBranch;
        listenerBranch = listenerBranch.parent();
        listenerBranch.removeChild(child);
    }

    if (this._listenerTree.empty()) {
        this._listening = false;
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
	var listeners = this._findListeners(Emitter._tokenizeEventType(eventType));
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
	this._subscriptionTreeMap = {};
	this._subscriptionIdIndex = 0;
};

return Emitter;
});

