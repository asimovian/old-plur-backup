/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject
 */
 'use strict';

define([
    'plur/PlurObject',
    'plur/test/Test',
    'plur/event/Emitter' ],
function(
    PlurObject,
    Test,
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

EmitterTest.prototype.testOn = function() {
    var self = this;
    // create a new emitter
    var emitter = new Emitter();

    // test exact events - should receive one call each
    this._assertListen(emitter, 'on.1', 1) ;
    this._assertListen(emitter, 'on.2', 1) ;
    // test wildcards - should collect two calls
    this._assertListen(emitter, 'on.*', 2);
    // test for event leakage - no events should be fired
    this._assertListen(emitter, 'on.0', 0);


    // emit
    this._assertEmit(emitter, 'on.1');
    this._assertEmit(emitter, 'on.2');

    this._assertExpectedEmissions();
};

EmitterTest.prototype._assertListen = function(emitter, event, expectedCount) {
    var self = this;
    this._actualEmittedEvents[event] = 0;
    this._expectedEmittedEvents[event] = expectedCount;

    emitter.on(this.eventNamepath + event, function() {
        self._actualEmittedEvents[event]++;
    });
};

EmitterTest.prototype._assertEmit = function(emitter, event) {
    emitter.emit(this.eventNamepath + event, { event: event});
};

EmitterTest.prototype._assertExpectedEmissions = function() {
console.log(this._actualEmittedEvents);
    for (var event in this._expectedEmittedEvents) {
        var expectedCount = this._expectedEmittedEvents[event];
        this.assertEquals(this._actualEmittedEvents[event], expectedCount, 'Emission count for ' + event);
    }
};

return EmitterTest;
});