/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject plur/error/Error plur/model/Transformer
 */
define([
    'plur/PlurObject',
    'plur/error/Error',
    'plur/model/Transformer' ],
function(
    PlurObject,
    PlurError,
    ModelTransformer ) {

/**
 * Encodes and decodes data objects to and from JSON.
 *
 * @constructor plur/json/model/Transformer
 * @extends plur/model/ModelTransformer
 **
 */
var JsonModelTransformer = function() {
};

JsonModelTransformer.prototype = PlurObject.create('plur/json/model/Transformer', ModelTransformer);

/**
 * Transforms a data object into a JSON string.
 *
 * @function plur/json/model/Transformer
 * @param {string} json
 * @param {function(Object model)} callback
 */
JsonModelTransformer.prototype.toModel = function(json) {
    var model = JSON.parse(json);
    return model;
};

/**
 * Transforms a JSON string into a data model.
 *
 */
JsonModelTransformer.prototype.fromModel = function(model) {
    let json = JSON.stringify(model);
    return json;
};

return JsonModelTransformer;
});