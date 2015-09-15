/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject
 */
define([
    'plur/PlurObject',
    'plur/model/Model' ],
function(
    PlurObject,
    Model ) {

/**
 * Data model for PlurError
 *
 * @constructor plur/error/ErrorModel
 * @extends plur/model/Model
 **
 */
var ErrorModel = function() {
};

ErrorModel.prototype = PlurObject.create('plur/error/ErrorModel', ErrorModel, Model);

ErrorModel.prototype.model = function() {
    var model = {
        namepath: this.namepath,
        message: this.message
    };

    return model;
};

ErrorModel.prototype.fromModel = function(model) {
    var object = new PlurError(model.message, model.data);
    return object;
};

return ErrorModel;
});
