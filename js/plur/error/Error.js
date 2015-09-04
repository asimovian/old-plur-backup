/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject
 */
define([
    'plur/PlurObject',
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
    Error.call(this, message);

    this.data = ( typeof data === 'undefined' ? null : data );
};

PlurError.prototype = PlurObject.create('plur/error/Error', PlurError, Error);

PlurError.fromModel = function(model) {
    let object = new PlurError(model.message, model.data);
    return object;
};

PlurError.prototype.model: function() {
    let model = {
        namepath: this.namepath;
        message: this.message;
    };

    return model;
};

return PlurError;
});