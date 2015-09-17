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
    PlurError ) {

/**
 * Errors thrown by assertions - typically in tests.
 *
 * @constructor plur/error/Assertion
 * @extends plur/error/Error
 **
 * @params {string} message
 * @params {=} data
 */
var AssertionError = function(message, data) {
    if (typeof message === 'object') {
        data = message;
        message = 'Assertion failed';
    } else if (typeof message === 'undefined') {
        message = 'Assertion failed';
    }

    PlurError.call(this, message, data);
};

AssertionError.prototype = PlurObject.create('plur/error/Assertion', AssertionError, PlurError);

AssertionError.assert = function(result, message) {
    if (!result) {
        throw new AssertionError(message, {expected: true, actual: false});
    }
};

return AssertionError;
});