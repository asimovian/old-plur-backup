/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject
 */
 'use strict';

define([
    'sleep',
    'plur/PlurObject',
    'plur/test/Test',
    'plur/event/Emitter' ],
function(
    sleep,
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
};

EmitterTest.prototype = PlurObject.create('plur-test/event/EmitterTest', EmitterTest, Test);

EmitterTest.prototype.testOn = function() {
    // test event response
    var passed = false;
    var emitter = new Emitter();
    emitter.on(this.namepath + '.test.1', function(event, data) {
       passed = true;
    });

    emitter.emit(this.namepath + '.test.1');
    this.assertUntil(250, 'Did not callback on emit', function() { return passed; });

    // test for listeners being called back for unexpected events
    var passed2 = true;
    emitter.on(this.namepath + '.test.0', function(event, data) {
        passed2 = false;
    });

    emitter.emit(this.namepath + 'test.1');
    this.assertUntil(250, 'Callback executed without event', function() { return passed2; });

    // test for wildcards
    var passed3 = false;
    emitter.on(this.namepath + '.test.*', function(event, data) {
        passed = true;
    })

    emitter.emit(this.namepath + '.test.1');

};

EmitterTest.prototype.assertUntil = function(timeout, message, assertionFunction) {
    var timeoutTime = new Date().getTimeMillis() + timeout;
    var sleepTime = 1000 * (timeout / 100);

    while (new Date().getTimeMillis() <= timeoutTime) {
        sleep.usleep(sleepTime);
        if (assertionFunction())
            return true;
    }

    this.fail(message || 'Assertion timed out');
};

return EmitterTest;
});