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
 * Basic unit and integration testing.
 *
 * @constructor plur/test/Test
 **
 */
var Test = function() {
};

Test.prototype = PlurObject.create('plur/test/Test', Test);

/**
 * Helper method that runs all test methods for this object (methods names that start with "test").
 */
Test.prototype.test = function() {
    for (var propertyName in this) {
        if (!propertyName.match(/^test/) || typeof this[propertyName] !== 'function' || propertyName === 'test') {
            continue;
        }

        this[propertyName]();
    }
};

/**
 * Determines whether a value is strictly equal.
 */
Test.prototype.assertEquals = function(actual, expected, message) {
    if (actual !== expected)
        throw new AssertionError(message || 'Values are not strictly equal', { expected: expected, actual: actual});
};

/**
 * Determines whether an object has its own copy of a property and whether it strictly equals the provided value.
 */
Test.prototype.assertOwns = function(object, propertyName, expected, message) {
    if (typeof object === 'undefined') {
        throw new AssertionError(message || 'Actual object is undefined', { expected: { propertyName: propertyName, value: expected }, actual: 'undefined' });
    } else if (!object.hasOwnProperty(propertyName)) {
        throw new AssertionError(message || 'Object does not own property', { expected: { propertyName: propertyName, value: expected }, actual: object[propertyName] });
    }

    this.assertEquals(object[propertyName], expected, message || 'Object does not own property');
};

/**
 * Creates an object with the expected configuration and ensures that proper construction, inheritance, etc.
 */
Test.prototype.assertCreation = function(expected, message) {
    var object = new expected.constructor(expected.constructionArguments);

    // check constructor
    this.assertEquals(object.constructor, expected.constructor, message || 'Constructor not found');

    // check parent constructor
    if (typeof expected.parentConstructor !== 'undefined') {
        this.assertEquals(Object.getPrototypeOf(object.constructor.prototype).constructor, expected.parentConstructor, message || 'Parent constructor not inherited')
    }

    // check constructor implemented
    if (typeof expected.interfaces !== 'undefined') {
        // create a hash array that matches PlurObject.implemented
        var expectedImplemented = {};
        for (var interfaceName in expected.interfaces) {
            expectedImplemented[expected.interfaces[interfaceName].namepath] = null;
        }

        this.assertEquals(object.constructor.implemented, expectedImplemented, message || 'Interface not implemented')
    }

    // check constructor namepath
    this.assertOwns(object.constructor, 'namepath', expected.namepath, message || 'Constructor does not own namepath');
    // check prototype namepath
    this.assertOwns(object.constructor.prototype, 'namepath', expected.namepath, message || 'Prototype does not own namepath');
    // check prototype implements method
    this.assertOwns(object.constructor.prototype, 'implementing', PlurObject.implementing, message || 'Prototype implements method not inherited');
};

/**
 * Determines whether an object has a property name in its prototype chain and ensures that it is strictly equal
 * to the expected value.
 */
Test.prototype.assertHas = function(object, propertyName, expected, message) {
    if (typeof object === 'undefined') {
        throw new AssertionError(message || 'Object is undefined', { expected: { value: expected, propertyName: propertyName }, actual: 'undefined' });
    } else if (typeof object[propertyName] === 'undefined') {
        throw new AssertionError(message || 'Object property is undefined', { expected: { value: expected, propertyName: propertyName }, actual: { object: object, value: 'undefined'} });
    } else if (typeof expected !== 'undefined' && object[propertyName] !== expected) {
        this.assertEquals(object[propertyName], expected, message);
    }
};

/**
 * Promotes alcoholism among QA developers.
 */
Test.prototype.fail = function(message, data) {
    throw new AssertionError(message || 'Assertion failed', data);
};

return Test;
});
