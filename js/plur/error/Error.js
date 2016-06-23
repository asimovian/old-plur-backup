/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject
 */
define([
    'plur/PlurObject' ],
function(
    PlurObject) {

/**
 * Errors thrown by the plur internal platform.
 *
 * @constructor plur/error/Error
 * @extends Error
 **
 * @params {string} message
 * @params {=} data
 */
var PlurError = function(message, data) {
    this.name = this.namepath;
    this.message = message;
    this.data = ( typeof data === 'undefined' ? null : data );

    Error.captureStackTrace(this, this.constructor);
};

PlurError.throwIf = function(testResult, message, data) {
    if (testResult) {
        throw new PlurError(message, data);
    }
};

PlurError.prototype = PlurObject.create('plur/error/Error', PlurError, Error);

PlurError.prototype.toString = function() {
    if (this.data === null)
        return 'Error (' + this.name + '): ' + this.message;

    return 'Error (' + this.name + '): ' + this.message + ' ; ' + JSON.stringify(this.data, PlurError._stringifyReplacer);
};

PlurError._stringifyReplacer = function(key, value) {
    switch(typeof value) {
    case 'undefined':
        return 'undefined';
    case 'function':
        return '[Function]';
    default:
        return value;
    };
};

return PlurError;
});