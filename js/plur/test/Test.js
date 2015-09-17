/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject plur/error/Assertion
 */
define([
    'plur/PlurObject',
    'plur/error/Assertion'],
function(
    PlurObject,
    AssertionError ) {

/**
 * Basic unit and itegration testing.
 *
 * @constructor plur/test/Test
 **
 */
var Test = function() {
};

Test.prototype = PlurObject.create('plur/test/Test', Test);

Test.prototype.test = function() {
    for (var propertyName in this) {
        if (!propertyName.match(/^test/) || typeof this[propertyName] !== 'function' || propertyName === 'test') {
            continue;
        }

        this[propertyName]();
    }
};

Test.prototype.assert = function(actual, expected) {
    if (actual !== expected)
        throw AssertionError(expected, actual);
};

Test.prototype.assertOwns = function(object, propertyName, expected) {
    if (!Object.hasOwnProperty(object, propertyName))
        throw AssertionError();
    if (typeof expected !== 'undefined' && object[propertyName] !== expected)
        throw AssertionError();
};

Test.prototype.assertCreation = function(expected) {
    var object = new expected.constructor.apply(null, expected.constructionArguments);

    // check constructor
    this.assert(object.constructor, expected.constructor);

    // check parent constructor
    if (typeof expected.parentConstructor !== 'undefined') {
        this.assert(object.constructor.prototype.constructor, expected.parentConstructor)
    }

    // check constructor implement method
    this.assert(object.constructor.implement, PlurObject.implement)

    // check constructor implemented
    if (typeof expected.interfaces !== 'undefined') {
        // create a hash array that matches PlurObject.implemented
        var expectedImplemented = {};
        for (var interfaceName in expected.interfaces) {
            expectedImplemented[expected.interfaces[interfaceName].namepath] = null;
        }

        this.assertEquals(object.constructor.implemented, expectedImplemented)
    }

    // check constructor namepath
    this.assertOwns(object.constructor, 'namepath', expected.namepath);
    // check prototype namepath
    this.assertOwns(object.prototype, 'namepath', expected.namepath);
    // check prototype implements method
    this.assertOwns(object.prototype, 'implementing', PlurObject.implementing);
};

Test.prototype.assertHas = function(object, propertyName, expected) {
    if (typeof object[propertyName] === 'undefined') {
        throw AssertionError();
    }

    if (typeof expected !== 'undefined' && object[propertyName] !== expected) {
        throw AssertionError();
    }
};

return Test;
});
