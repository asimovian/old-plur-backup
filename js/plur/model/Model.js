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
 * @abstract
 **
 */
var Model = function() {
};

Model.prototype = PlurObject.create('plur/model/Model', Model);

/**
 * Creates a simple data model of this object.
 *
 * @function plur/model/Model.prototype.model
 * @abstract
 * @param {} object
 * @returns {} model
 */
Model.prototype.model = function(v, options) {
    var override = ( typeof options !== 'undefined' && options.override === false ? false : true );

    switch(typeof v) {
    case 'string':
    case 'number':
    case 'boolean':
        return v;
        break;

    case 'object':
        if (Array.isArray(v)) {
            // handle arrays
            var model = [];

            for (var i = 0; i < v.length; ++i) {
                var m = PlurObject.model(v[i], options);
                if (m !== null) {
                    model.push(m);
                }
            }

            return model;
        } else if (!override && Object.hasOwnProperty(v.prototype, 'model') && typeof v.model === 'function') {
                return v.model();
        } else {
            // build the model using only public variables
            var model = {};

            for (var propertyName in v)  {
                // only include public variables (starts with a lower case letter)
                if (!propertyName.match(/^[a-z]/)) {
                    continue;
                }

                var m = PlurObject.model(v[propertyName], options);
                if (m !== null) {
                    model[propertyName] = m;
                }
            }

            return model;
        }
        break;

    default:
        return null;
    }
};

/**
 * Constructs an object from a data model.
 *
 * @function plur/model/Model.prototype.model
 * @abstract
 * @param {} model
 * @returns {} object
 */
Model.prototype.fromModel = createFromModel = function(model, callback) {
    if (typeof model.namepath === 'undefined') {
        callback(model);
    }

    requirejs([model.namepath], function(constructor) {
        if (typeof constructor.fromModel === 'function') {
            var object = constructor.fromModel(model);
            callback(object);
        } else {
            var object = new Constructor();

            for (var propertyName in model) {
                if (!propertyName.match(/^[a-z]/)) {
                    continue;
                }

                object[propertyName] = this._createFromModel(model[propertyName]);
            }

            callback(object);
        }
    });
};


return Model;
});