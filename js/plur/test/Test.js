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
    for (var key in this) {
        if (!(key.match(/^test/) && typeof this[key] === 'function')) {
            continue;
        }

        this[key]();
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

Test.prototype.assertCreation(expected) {
    var object = new expected.constructor.apply(null, expected.constructionArguments);

    // interfaces for comparison
    var expectedImplemented = {};
    for (var interface in expected.interfaces) {
        expectedImplemented[interface.namepath] = null;
    }

    // check constructor
    this.assert(object.constructor, expected.constructor);
    // check parent constructor
    this.assert(object.constructor.prototype.constructor, expected.parentConstructor)
    // check constructor implement method
    this.assert(object.constructor.implement, PlurObject.implement)
    // check constructor implemented
    this.assertEquals(object.constructor.implemented, expectedImplemented)
    // check constructor namepath
    this.assertOwns(object.constructor, 'namepath', expected.namepath);
    // check prototype namepath
    this.assertOwns(object.prototype, 'namepath', expected.namepath);
    // check prototype implements method
    this.assertOwns(object.prototype, 'implements', PlurObject.implements);
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
