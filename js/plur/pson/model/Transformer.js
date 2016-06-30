/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject plur/error/Error plur/model/Transformer
 */
define([
    'plur/PlurObject',
    'plur/error/Error',
    'plur/model/Transformer',
    'plur/pson/Singleton' ],
function(
    PlurObject,
    PlurError,
    Pson ) {

/**
 * Encodes and decodes data objects to and from JSON.
 *
 * @constructor plur/pson/model/Transformer
 * @extends plur/model/ModelTransformer
 **
 */
var PsonModelTransformer = function() {
};

PsonModelTransformer.prototype = PlurObject.create('plur/pson/model/Transformer', ModelTransformer);

/**
 * Transforms a JSON string into a data model.
 *
 * @function plur/pson/model/Transformer
 * @param {string} pson
 * @returns {}
 */
PsonModelTransformer.prototype.decode = function(pson) {
    var model = Pson.get().decode(pson);
    return model;
};

/**
 * Transforms a data model into the subject format.
 *
 * @function plur/model/Transformer
 * @param {} model
 * @returns {string}
 */
PsonModelTransformer.prototype.encode = function(model) {
    var pson = Pson.get().encode(model);
    return pson;
};

return PsonModelTransformer;
});