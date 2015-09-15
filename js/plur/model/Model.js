/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject
 */
define([
    'plur/PlurObject' ],
function(
    PlurObject ) {

/**
 * Converts an object to / from a simple data model.
 *
 * @constructor plur/model/Model
 * @interface
 **
 */
var Model = function() {
    throw new Error('Cannot instantiate interface.');
};

Model.prototype = PlurObject.create('plur/model/Model', Model);

/**
 * Creates a simple data model of this object.
 *
 * @function plur/model/Model.prototype.model
 * @virtual
 * @param {} object
 * @returns {} model
 */
Model.prototype.model = PlurObject.pureVirtualFunction;

/**
 * Constructs an object from a data model.
 *
 * @function plur/model/Model.prototype.model
 * @virtual
 * @param {} model
 * @returns {} object
 */
Model.prototype.fromModel = PlurObject.pureVirtualFunction;


return Model;
});