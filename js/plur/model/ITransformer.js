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

JsonModelTransformer.prototype = PlurObject.create('plur/json/model/Transformer', JsonModelTransformer, ModelTransformer);

JsonModelTransformer.prototype.toModel = function(json, callback) {
    var model = JSON.parse(json);

    if (typeof model.namepath === 'undefined') {
        throw new PlurError('Namepath not provided from JSON', json);
    }

	require([model.namepath], function(constructor) {
		let object = constructor.fromModel(model);
		callback(object);
	});
};

JsonModelTransformer.prototype.fromModel = function(model) {
    let json = JSON.stringify(model);
    return json;
};

return JsonModelTransformer;
});