/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject plur/error/Error
 */
define([
    'plur/PlurObject',
    'plur/error/Error' ],
function(
    PlurObject,
    Error ) {

/**
 * Errors thrown by assertions - typically in tests.
 *
 * @constructor plur/error/Assertion
 * @extends plur/error/Error
 **
 * @params {string} message
 * @params {=} data
 */
var AssertionError = function(expected, actual, message) {
    if (typeof message === 'undefined')
        message = 'Assertion failed';

    Error.call(this, message);

    this.data = {
        expected: expected,
        actual: actual
    };
};

AssertionError.prototype = PlurObject.create('plur/error/Assertion', AssertionError, Error);

AssertionError.assert = function(result) {
    if (!result) {
        throw new AssertionError();
    }
};

return AssertionError;
});