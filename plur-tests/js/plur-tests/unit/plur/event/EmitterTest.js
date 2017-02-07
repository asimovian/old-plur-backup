/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject
 */
 'use strict';

define([
    'plur/PlurObject',
    'plur/test/Test',
    'plur/event/Event',
    'plur/event/Emitter' ],
function(
    PlurObject,
    Test,
    Event,
    Emitter ) {

/**
 * Tests the event emitter.
 *
 * @constructor plur-tests/event/EmitterTest
 * @extends plur/test/Test
 * @tests plur/event/Emitter
 **
 */
var EmitterTest = function() {
    Test.call(this);

    this.eventNamepath = this.namepath + '.test.';
    this._expectedEmittedEvents = {};
    this._actualEmittedEvents = {};
};

EmitterTest.prototype = PlurObject.create('plur-tests/event/EmitterTest', EmitterTest, Test);

/**
 * @function plur-tests/unit/plur/event/EmitterTest.prototype.testOn
 * @tests plur/event/Emitter.prototype.on
 * @throws Error
 */
EmitterTest.prototype.testOn = function() {
    // create a new emitter
    var emitter = new Emitter();

    // test for event leakage - no events should be fired
    this._assertListen(emitter, 'on.0', 0);
    // test for exact event type matches
    this._assertListen(emitter, 'on.1', 1); // emitted once
    this._assertListen(emitter, 'on.2', 2); // emitted twice
    // test wildcards - should collect four calls
    this._assertListen(emitter, 'on.*', 4); // emitted for both on.1 and on.2 (twice); as well as on.3.next
    // emit
    this._assertEmit(emitter, 'on.1');
    this._assertEmit(emitter, 'on.2'); // emit this twice
    this._assertEmit(emitter, 'on.2');
    this._assertEmit(emitter, 'on.3.next');

    this._assertExpectedEmissions();
};

/**
 * @function plur-tests/unit/plur/event/EmitterTest.prototype.testOnce
 * @tests plur/event/Emitter.prototype.once
 * @throws Error
 */
EmitterTest.prototype.testOnce = function() {
    // create a new emitter
    var emitter = new Emitter();

    this._assertListenOnce(emitter, 'once.0', 0); // never emitted
    // test for exact event type matches
    this._assertListenOnce(emitter, 'once.1', 1); // emitted once
    this._assertListenOnce(emitter, 'once.2', 1); // emitted once, second time, not listening

    // test wildcards and test re-subscribing on the same event type. should be called after each emit to resub.
    this._assertListenOnce(emitter, 'once.*', 3); // emitted for both on.1 and on.2; thrice!

    // emit
    this._assertEmit(emitter, 'once.1'); // first and only
    this._assertListenOnce(emitter, 'once.*', 3); // for re-sub test #2
    this._assertEmit(emitter, 'once.2'); // emit this twice ... #1
    this._assertListenOnce(emitter, 'once.*', 3); // for re-sub test #3
    this._assertEmit(emitter, 'once.3'); // #2

    this._assertExpectedEmissions();
};

/**
 * @function plur-tests/unit/plur/event/EmitterTest.prototype.testListening
 * @tests plur/event/Emitter.prototype.listening
 * @throws Error
 */
EmitterTest.prototype.testListening = function() {
    // create a new emitter
    var emitter = new Emitter();

    this.assert(!emitter.listening(), 'Emitter is listening on creation');

    this._assertListenOnce(emitter, 'listening.1', 2);
    this.assert(emitter.listening(), 'Emitter is not listening after once()');

    this._assertEmit(emitter, 'listening.1');
    this.assert(!emitter.listening(), 'Emitter is listening after once()+emit()');

    // once more ...

    this._assertListenOnce(emitter, 'listening.1', 2);
    this.assert(emitter.listening(), 'Emitter is not listening after once()');

    this._assertEmit(emitter, 'listening.1');
    this.assert(!emitter.listening(), 'Emitter is listening after once()+emit()');

};

EmitterTest.prototype.testUnsubscribe = function() {
    var emitter = new Emitter();

    var subscriptionId = this._assertListen(emitter,'unsubscribe.1', 1);
    this._assertEmit(emitter, 'unsubscribe.1');
    emitter.unsubscribe(subscriptionId);
    this._assertEmit(emitter, 'unsubscribe.1');

    this._assertExpectedEmissions();
};

EmitterTest.prototype.testEmit = function() {
    var emitter = new Emitter();

    this._assertListenOnce(emitter, 'emit.1', 1);
    this._assertEmit(emitter, 'emit.1')

    this._assertExpectedEmissions()
};

EmitterTest.prototype._assertListenOnce = function(emitter, eventType, expectedCount) {
    return this._assertListen(emitter, eventType, expectedCount, true);
};

/**
 * Adds a listener to the provided emitter. Prefixes the specified event with the classes's namespace.
 * Adds the event type to the list of expected emissions along with the expected emission count, to be
 * verified on each call to _assertExpectedEmissions.
 *
 * @function plur-tests/unit/plur/event/EmitterTest.prototype._assertListen
 * @param plur/event/Emitter emitter
 * @param string eventType
 * @param int expectedCount
 * @throws Error On anything unexpected
 */
EmitterTest.prototype._assertListen = function(emitter, eventType, expectedCount, _once) {
    var self = this;
    var once = ( !!_once );

    var fullEventType = this.eventNamepath + eventType;

    // set actual and expected counts for later testing
    if (typeof this._actualEmittedEvents[eventType] === 'undefined') { // don't reset actual count on re-sub
        this._actualEmittedEvents[eventType] = 0;
    }

    this._expectedEmittedEvents[eventType] = expectedCount;

    // the emit callback
    var onEmit = function(event) {
        self.assert(event instanceof Event, 'Invalid event');
        self.assert(typeof event.getType() === 'string', 'Invalid event type');
        self.assert(typeof event.getData() === 'object', 'Invalid event data');
        self.assert(typeof event.getData().test === 'object', 'Invalid event data container');
        self.assert(typeof event.getData().test.eventType === 'string', 'Invalid event data item');
        self._actualEmittedEvents[eventType]++;
    };

    var subscriptionId = null;
    if (once) {
        // subscribe to the emitter. one ping only.
        subscriptionId = emitter.once(fullEventType, onEmit, fullEventType);
    } else {
        // subscribe to the emitter
        subscriptionId = emitter.on(fullEventType, onEmit, fullEventType);
    }

    return subscriptionId;
};



/**
 * Emit an event to the given emitter, using the class's event namepath as the prefix.
 * Passes a data structure of { event: string event }
 * Intended to be used after one or more setup calls to _assertListen.
 *
 * @function plur-tests/unit/plur/event/EmitterTest.prototype._assertEmit
 * @param plur/event/Emitter emitter
 * @param string eventType
 * @throws Error On anything unexpected.
 */
EmitterTest.prototype._assertEmit = function(emitter, eventType) {
    emitter.emit(this.eventNamepath + eventType, { test: { eventType: eventType} });
};

/**
 * Compares all expected emitter event counts against actual ejvent counts.
 * Intended to be called after one or more _assertEmit calls. Does not reset counts, so unique event types
 * should be used.
 *
 * @function plur-tests/unit/plur/event/EmitterTest.prototype._assertExpectedEmissions
 * @throws Error on invalid emission counts or anything else unexpected
 */
EmitterTest.prototype._assertExpectedEmissions = function() {
    for (var event in this._expectedEmittedEvents) {
        var expectedCount = this._expectedEmittedEvents[event];
        this.assertEquals(this._actualEmittedEvents[event], expectedCount, 'Incorrect emission count for event: ' + event);
    }
};

return EmitterTest;
});