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
 * @constructor plur/error/NeedsCoffee
 * @extends plur/error/Error
 **
 * @params {string} message
 * @params {=} data
 */
var NeedsCoffeeError = function(message, data) {
    if (typeof message === 'object') {
        data = message;
        message = 'Unexpected data type';
    } else if (typeof message === 'undefined') {
        message = 'Unexpected data type';
    }

    PlurError.call(this, message, data);
};

NeedsCoffeeError.prototype = PlurObject.create('plur/error/NeedsCoffee', NeedsCoffeeError, PlurError);

return NeedsCoffeeError;
});