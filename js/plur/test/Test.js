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
    for (let key in this) {
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

Test.prototype.owns = function(object, propertyName, expected) {
    if (!Object.hasOwnProperty(object, propertyName))
        throw AssertionError();
    if (typeof expected !== 'undefined' && object[propertyName] !== expected)
        throw AssertionError();
};

return Test;
});
