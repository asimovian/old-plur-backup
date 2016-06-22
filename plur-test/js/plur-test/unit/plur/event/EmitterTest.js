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
 * @constructor plur-test/event/EmitterTest
 * @extends plur/test/Test
 * @tests plur/event/Emitter
 **
 */
var EmitterTest = function() {
    this.eventNamepath = this.namepath + '.test.';
    this._expectedEmittedEvents = {};
    this._actualEmittedEvents = {};
};

EmitterTest.prototype = PlurObject.create('plur-test/event/EmitterTest', EmitterTest, Test);

/**
 * @function plur-test/unit/plur/event/EmitterTest.prototype.testOn
 * @tests plur/event/Emitter.prototype.on
 * @throws Error
 */
EmitterTest.prototype.testOn = function() {
    var self = this;
    // create a new emitter
    var emitter = new Emitter();

    // test for event leakage - no events should be fired
    this._assertListen(emitter, 'on.0', 0);
    // test for exact event type matches
    this._assertListen(emitter, 'on.1', 1); // emitted once
    this._assertListen(emitter, 'on.2', 2); // emitted twice
    // test wildcards - should collect two calls
    this._assertListen(emitter, 'on.*', 3); // emitted for both on.1 and on.2; thrice!

    // emit
    this._assertEmit(emitter, 'on.1');
    this._assertEmit(emitter, 'on.2'); // emit this twice
    this._assertEmit(emitter, 'on.2');

    this._assertExpectedEmissions();
};

/**
 * Adds a listener to the provided emitter. Prefixes the specified event with the classes's namespace.
 * Adds the event type to the list of expected emissions along with the expected emission count, to be
 * verified on each call to _assertExpectedEmissions.
 *
 * @function plur-test/unit/plur/event/EmitterTest.prototype._assertListen
 * @param plur/event/Emitter emitter
 * @param string eventType
 * @param int expectedCount
 * @throws Error On anything unexpected
 */
EmitterTest.prototype._assertListen = function(emitter, eventType, expectedCount) {
    var self = this;
    var fullEventType = this.eventNamepath + eventType;

    // set actual and expected counts for later testing
    this._actualEmittedEvents[eventType] = 0;
    this._expectedEmittedEvents[eventType] = expectedCount;

    // subscribe to the emitter
    emitter.on(fullEventType, function(event) {
        self.assert(event instanceof Event, true, 'Invalid event');
        self.assert(typeof event.getType() === 'string', true, 'Invalid event type');
        self.assert(typeof event.getData() === 'object', true, 'Invalid event data');
        self.assert(typeof event.getData().test === 'object', true, 'Invalid event data container');
        self.assert(typeof event.getData().test.eventType === 'string', true, 'Invalid event data item');
        self._actualEmittedEvents[eventType]++;
    }, fullEventType);
};

/**
 * Emit an event to the given emitter, using the class's event namepath as the prefix.
 * Passes a data structure of { event: string event }
 * Intended to be used after one or more setup calls to _assertListen.
 *
 * @function plur-test/unit/plur/event/EmitterTest.prototype._assertEmit
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
 * @function plur-test/unit/plur/event/EmitterTest.prototype._assertExpectedEmissions
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