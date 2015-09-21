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
 * @constructor plur/error/State
 * @extends plur/error/Error
 **
 * @params {string} message
 * @params {=} data
 */
var StateError = function(message, data) {
    if (typeof message === 'object') {
        data = message;
        message = 'Invalid state';
    } else if (typeof message === 'undefined') {
        message = 'Invalid state';
    }

    PlurError.call(this, message, data);
};

StateError.prototype = PlurObject.create('plur/error/State', StateError, PlurError);

return StateError;
});