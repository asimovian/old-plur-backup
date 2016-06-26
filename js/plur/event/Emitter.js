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
    'plur/event/Event',
    'plur/design/tree/MapNode' ],
function(
    PlurObject,
    Assertion,
    PlurTypeError,
    PlurStateError,
    Event,
    MapTreeNode ) {
	
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

	 * @var plur/design/tree/MapNode
	 */
	this._listenerTree = new MapTreeNode();
	this._persistentEvents = {};
};

Emitter.prototype = PlurObject.create('plur/event/Emitter', Emitter);

/**
 * Listener entry for use in the listner tree.
 *
 * @constructor plur/event/Emitter._Listener
 **
 * @param string eventType
 * @param Function(plur/event/Event event) callback
 * @param int subscriptionId
 * @param boolean temporary
 */
Emitter._Listener = function(eventType, callback, subscriptionId, temporary) {
	Assertion.assert(!this._destroyed, PlurStateError, 'Emitter has been destroyed');

    this.eventType = eventType;
    this.subscriptionId = subscriptionId;
    this.callback = callback;
    this.temporary = !!temporary;
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
 * @constructor plur/event/Emitter._ListenerTreeValue
 **
 * @param {}|undefined listeners
 * @param {}|undefined childListeners
 */
Emitter._ListenerTreeValue = function(listeners, childListeners) {
    this.listeners = listeners || {}; // map: subscriptionId => listener
    this.childListeners = childListeners || {}; // map: subscriptionId => listener
};

Emitter._ListenerTreeValue.prototype = PlurObject.create('plur/event/Emitter._ListenerTreeValue',
    Emitter._ListenerTreeValue );

/**
 * Adds a listener.
 *
 * @function plur/event/Emitter._ListenerTreeValue.prototype.appendTree
 */
Emitter._ListenerTreeValue.prototype.addListener = function(listener) {
    this.listeners[listener.subscriptionId] = listener;
};

/**
 * Adds a child listener.
 *
 * @function plur/event/Emitter._ListenerTreeValue.prototype.appendTree
 */
Emitter._ListenerTreeValue.prototype.addChildListener = function(listener) {
    this.childListeners[listener.subscriptionId] = listener;
};

/**
 * Removes a listener by its subscription id.
 *
 * @function plur/event/Emitter._ListenerTreeValue.prototype.removeListener
 */
Emitter._ListenerTreeValue.prototype.removeListener = function(subscriptionId) {
    delete this.listeners[subscriptionId];
    delete this.childListeners[subscriptionId];
};

/**
 * Retrieves listeners.
 *
 * @function plur/event/Emitter._ListenerTreeValue.prototype.getListeners
 * @returns plur/event/Emitter._ListenerTreeValue[]
 */
Emitter._ListenerTreeValue.prototype.getListeners = function() {
    return PlurObject.values(this.listeners);
};

/**
 * Retrieves child listeners.
 *
 * @function plur/event/Emitter._ListenerTreeValue.prototype.getChildListeners
 * @returns plur/event/Emitter._ListenerTreeValue[]
 */
Emitter._ListenerTreeValue.prototype.getChildListeners = function() {
    return PlurObject.values(this.childListeners);
};

/**
 * Determines whether this node has children and/or whether it has listeners or not.
 *
 * @function plur/event/Emitter._ListenerTreeValue.prototype.listening
 * @returns boolean isEmpty TRUE if listening, FALSE if not
 */
Emitter._ListenerTreeValue.prototype.listening = function() {
    return ( Object.keys(this.listeners).length !== 0 || Object.keys(this.childListeners).length !== 0 );
};

/**
 * @var string Emitter.WILDCARD The event type wildcard. When used, it will catch any event that has the preceding token
 * in its path.
 */
Emitter.WILDCARD = '*';

/**
 * Splits an event type string into a string array of individual tokens. Splits on / and . characters.
 * E.g., foo/bar.* => [ 'foo', 'bar', '*' ]
 *
 * @function plur/event/Emitter._tokenizeEventType
 * @param string eventType
 * @returns string[] eventTypeTokens
 */
Emitter._tokenizeEventType = function(eventType) {
    return eventType.split(/[\/\.]/);
};


/**
 * Finds all listeners applicable to the provided event type.
 *
 * @function plur/event/Emitter.prototype._findListeners
 * @param string[] eventTypeTokens
 * @returns plur/event/Emitter._Listener[] listeners
 */
Emitter.prototype._findListeners = function(eventTypeTokens) {
    var listeners = [];
    var branch = this._listenerTree;

    for (var i = 0, n = eventTypeTokens.length; i < n; ++i) {
        var token = eventTypeTokens[i];
        var branch = branch.child(eventTypeTokens[i]);
        if (branch === null) {
            break;
        }

        var branchValue = branch.get();

        if (i+1 === n) { // last node, get exact listeners
            listeners = listeners.concat(branchValue.getListeners());
        } else { // preceding node, get child listeners
            listeners = listeners.concat(branchValue.getChildListeners());
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

/**
 * Subscribes a listener callback to an eventType
 *
 * @function plur/event/Emitter.prototype._subscribe
 * @param string eventType
 * @param Function(plur/event/Event event) callback
 * @param boolean temporary TRUE for once(), false for on()
 * @returns int subscriptionId
 */
Emitter.prototype._subscribe = function(eventType, callback, temporary) {
    var listener = new Emitter._Listener(eventType, callback, this._nextSubscriptionId(), temporary);
    var eventTypeTokens = Emitter._tokenizeEventType(eventType);
    var isWildcard = ( eventTypeTokens[eventTypeTokens.length - 1] === Emitter.WILDCARD );
    var branch = null;

    if (isWildcard) {
        eventTypeTokens = eventTypeTokens.slice(0, -1); // remove the trailing wildcard token
        branch = this._listenerTree.expand(eventTypeTokens, Emitter._ListenerTreeValue);
        branch.get().addChildListener(listener);
    } else {
        branch = this._listenerTree.expand(eventTypeTokens, Emitter._ListenerTreeValue);
        branch..get().addListener(listener);
    }

    this._subscriptionTreeMap[listener.subscriptionId] = branch;

   	if (!this._listening) {
	    this._listening = true;
	}

	return listener.subscriptionId;
};

/**
 * Returns a subscription id that is not currently being used by this emitter.
 *
 * @function plur/event/Emitter.prototype._nextSubscriptionId
 * @returns int
 */
Emitter.prototype._nextSubscriptionId = function() {
    for (var id = null; id === null ; ) {
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
	Assertion.assert(listenerBranch !== null, 'Listener branch is missing.')

    listenerBranch.removeListener(subscriptionId);

	// prune childless tree nodes.
    while (!listenerBranch.isRoot() && listenerBranch.isLeaf() && !listenerBranch.get().listening()) {
        var child = listenerBranch;
        listenerBranch = listenerBranch.parent();
        listenerBranch.removeChild(child);
    }

    if (this._listenerTree.isLeaf() && !this._listenerTree.get().listening()) {
        this._listening = false;
    }
};

/**
 * Publishes an event (with data) to this emitter. All listeners subscribed to the event will have their provided
 * callbacks executed.
 *
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
 *
 * @function plur/event/Emitter.prototype.destroy
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

