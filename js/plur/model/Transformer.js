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
 * Transforms data objects to and from other formats (e.g., JSON, XML, ProtoBuff, etc.).
 *
 * @constructor plur/model/Transformer
 * @abstract
 **
 */
var ModelTransformer = function() {
};

ModelTransformer.prototype = PlurObject.create('plur/json/model/Transformer', ModelTransformer);

/**
 * Transforms a subject format into a data model object.
 *
 * @function plur/model/Transformer
 * @virtual
 * @param {*}
 * @param {function(Object model)} callback
 * @returns {}
 */
ModelTransformer.prototype.toModel = PlurObject.abstractMethod;

/**
 * Transforms a data model into the subject format.
 *
 * @function plur/model/Transformer
 * @virtual
 * @param {} model
 * @returns {}
 */
ModelTransformer.prototype.fromModel = PlurObject.abstractMethod;

return ModelTransformer;
});