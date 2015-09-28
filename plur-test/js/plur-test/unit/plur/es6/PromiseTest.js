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
 * @constructor plur-test/plur/es6/PromiseTest
 * @tests plur/es6/Promise
 **
 */
var PromiseTest = function() {
};

PromiseTest.prototype = PlurObject.create('plur-test/plur/es6/PromiseTest', PromiseTest, Test);

PromiseTest.prototype.testPromise = function() {
    var promise = new PlurPromise(function(resolve, reject) { resolve(true); });
    promise.then(function() { console.log('resolved once'); }, function() { console.log('rejected once'); });
    promise.then(function() { console.log('resolved twice'); }, function() { console.log('rejected twice'); });

    promise = new PlurPromise(function(resolve, reject) { reject(true); });
    promise.then(function() { console.log('resolved once'); }, function() { console.log('rejected once'); });
    promise.then(function() { console.log('resolved twice'); }, function() { console.log('rejected twice'); });
};

return PromiseTest;
});