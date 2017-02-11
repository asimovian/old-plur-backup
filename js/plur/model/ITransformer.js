/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject plur/error/Error plur/model/Transformer
 */
define([
    'plur/PlurObject',
    'plur/error/Interface' ],
function(
    PlurObject,
    InterfaceError ) {

/**
 * Transforms data objects to and from other formats (e.g., JSON, XML, ProtoBuff, etc.).
 *
 * @constructor plur/model/ITransformer
 * @interface
 **
 */
var IModelTransformer = function() { throw new InterfaceError(this); }

IModelTransformer.prototype = PlurObject.create('plur/model/ITransformer', IModelTransformer);

/**
 * Transforms a subject format into a data model object.
 *
 * @function plur/model/ITransformer.prototype.encode
 * @abstract
 * @param {*}
 * @returns {}
 */
IModelTransformer.prototype.encode = PlurObject.abstractMethod;

/**
 * Transforms a data model into the subject format.
 *
 * @function plur/model/Transformer.prototype.decode
 * @abstract
 * @param {} model
 * @returns {}
 */
IModelTransformer.prototype.decode = PlurObject.abstractMethod;


return ModelTransformer;
});