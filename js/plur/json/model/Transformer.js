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
 * Transforms a JSON string into a data model.
 *
 * @function plur/json/model/Transformer
 * @param {string} json
 * @returns {}
 */
JsonModelTransformer.prototype.toModel = function(json) {
    var model = JSON.parse(json);
    return model;
};

/**
 * Transforms a data model into the subject format.
 *
 * @function plur/model/Transformer
 * @param {} model
 * @returns {string}
 */
JsonModelTransformer.prototype.fromModel = function(model) {
    let json = JSON.stringify(model);
    return json;
};

return JsonModelTransformer;
});