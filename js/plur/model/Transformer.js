/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject plur/error/Error plur/model/Translator
 */
define([
    'plur/PlurObject',
    'plur/error/Error',
     'plur/model/Translator' ],
function(
    PlurObject,
    PlurError,
    ModelTranslator ) {

/**
 * Encodes and decodes data objects to and from JSON.
 *
 * @constructor plur/json/model/Translator
 * @extends plur/model/ModelTranslator
 **
 */
var JsonModelTranslator = function() {
};

JsonModelTranslator.prototype = PlurObject.create('plur/json/model/Translator', JsonModelTranslator, ModelTranslator);

JsonModelTranslator.prototype.decode = function(model, callback) {
    var results = [];
    var models = JSON.parse(json);

    if (typeof models.length === 'undefined') {
        models = [models];
    }

    for (let i = 0, models; i < models.length; ++i) {
        let model = models[i];
        let namepath = models[i].namepath;
        this._instantiate(namepath, model, function(instance) {
            results.push(instance);
            if (results.length === models.length) {
                callback(results);
            }
        });
    }
};

/**
 * Instantiates a new instance of a given prototype (loading its constructor if necessary) and returns it via callback.
 *
 * @function plur/model/Translator.prototype._instantiate
 * @param {string} namepath
 * @param {model}
 */
ModelTranslator.prototype._instantiate = function(namepath, model, callback) {
	require([namepath], function(Constructor) {
		var instance = Constructor.fromObj(model);
		callback(instance);
	});
};

JsonModelTranslator.singleton = new JsonModelTranslator();

return JsonModelTranslator.singleton;
});