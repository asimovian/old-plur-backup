/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject plur/test/Test
 */
 'use strict';

define([
    'plur/PlurObject',
    'plur/test/Test',
    'plur/es6/Promise' ],
function(
    PlurObject,
    Test,
    PlurPromise ) {

/**
 * Tests the ES6 Promise wrapper.
 *
 * @constructor plur-tests/plur/es6/PromiseTest
 * @tests plur/es6/Promise
 **
 */
var PromiseTest = function() {
    Test.call(this);

    this._promiseHandlerIndex = 0;
};

PromiseTest.prototype = PlurObject.create('plur-tests/plur/es6/PromiseTest', PromiseTest, Test);

PromiseTest.prototype.testConstruct = function() {
    // promise nested in constructor, resolve -> resolve
    var promise = new PlurPromise(function(resolve, reject) {
        var innerPromise = new PlurPromise(function(innerResolve, innerReject) {
            innerResolve();
        });

        // pass on to the outter promise
        innerPromise.then(resolve, reject);
    });

    promise.then(this._assertResolved('then', true), this._assertRejected('then', false));

    // promise nested in constructor, reject -> reject
    promise = new PlurPromise(function(resolve, reject) {
        var innerPromise = new PlurPromise(function(innerResolve, innerReject) {
            innerReject();
        });

        // pass on to the outter promise
        innerPromise.then(resolve, reject);
    });

    promise.then(this._assertResolved('then', false), this._assertRejected('then', true));

    this.assertExpectedEmissions();
};

PromiseTest.prototype.testThen = function() {
    // one promise, resolve
    var promise = new PlurPromise(function(resolve, reject) { resolve(); });
    promise.then(this._assertResolved('then', true), this._assertRejected('then', false));
    promise.then(this._assertResolved('then', true), this._assertRejected('then', false));
    promise.then(this._assertResolved('then', true), this._assertRejected('then', false));

    // one promise, reject
    promise = new PlurPromise(function(resolve, reject) { reject(); });
    promise.then(this._assertResolved('then', false), this._assertRejected('then', true));
    promise.then(this._assertResolved('then', false), this._assertRejected('then', true));
    promise.then(this._assertResolved('then', false), this._assertRejected('then', true));

    // promise nested in then, resolve -> resolve
    promise = new PlurPromise(function(resolve, reject) { resolve(); });
    promise.then(function() {
        var innerPromise = new PlurPromise(function(innerResolve, innerReject) {
            innerResolve();
        });
    }, this._assertRejected('then', false));

    promise.then(this._assertResolved('then', true), this._assertRejected('then', false));

    // promise nested in then, reject -> reject
    promise = new PlurPromise(function(resolve, reject) { reject(); });
    promise.then(this._assertResolved('then', false), function() {
        var innerPromise = new PlurPromise(function(innerResolve, innerReject) {
            innerReject();
        });
    });

    promise.then(this._assertResolved('then', false), this._assertRejected('then', true));

    this.assertExpectedEmissions();
};

PromiseTest.prototype._assertResolved = function(eventTypePrefix, expected) {
    var self = this;
    var eventTypeSuffix = eventTypePrefix + '.resolved.' + ++this._promiseHandlerIndex;

    this.assertEmission(eventTypeSuffix, expected ? 1 : 0);

    return function() {
        self.emit(eventTypeSuffix);
    };
};

PromiseTest.prototype._assertRejected = function(eventTypePrefix, expected) {
    var self = this;
    var eventTypeSuffix = eventTypePrefix + '.rejected.' + ++this._promiseHandlerIndex;

    this.assertEmission(eventTypeSuffix, expected ? 1 : 0);

    return function() {
        self.emit(eventTypeSuffix);
    };
};



return PromiseTest;
});