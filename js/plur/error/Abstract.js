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
 * Thrown on an attempt to instantiate an abstract prototype.
 *
 * @constructor plur/error/Type
 * @extends plur/error/Error
 **
 * @params {string} message
 * @params {=} data
 */
var AbstractError = function(message, data) {
    if (typeof message === 'object') {
        data = message;
        message = 'Cannot instantiate abstract prototype.';
    } else if (typeof message === 'undefined') {
        message = 'Cannot instantiate abstract prototype.';
    }

    PlurError.call(this, message, data);
};

AbstractError.prototype = PlurObject.create('plur/error/Type', AbstractError, PlurError);

return AbstractError;
});