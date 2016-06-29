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
 * Thrown on an attempt to instantiate an interface prototype.
 *
 * @constructor plur/error/Type
 * @extends plur/error/Error
 **
 * @params {string} message
 * @params {=} data
 */
var InterfaceError = function(message, data) {
    if (typeof message === 'object') {
        data = message;
        message = 'Cannot instantiate interface prototype.';
    } else if (typeof message === 'undefined') {
        message = 'Cannot instantiate interface prototype.';
    }

    PlurError.call(this, message, data);
};

InterfaceError.prototype = PlurObject.create('plur/error/Type', InterfaceError, PlurError);

return InterfaceError;
});