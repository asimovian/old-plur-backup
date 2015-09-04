/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires require
 */
define([
    'require'],
function(
    require ) {

/**
 * Utility for prototype object construction.
 *
 * @constructor plur/PlurObject
 */
var PlurObject = function() {
    throw Error('Cannot instantiate');
};

// Standardize PlurObject
PlurObject.namepath = 'plur/PlurObject';
PlurObject.prototype.namepath = PlurObject.namepath;

PlurObject.implements = function(interfaceConstructor, object) {
    let o = ( object || this );
    return ( typeof o.prototype.implements !== 'undefined' &&
            && typeof o.prototype.implements[interfaceConstructor.namepath] !== 'undefined' );
};

/**
 * Meant to be assigned to abstract prototype functions that require overriding in child classes.
 *
 * @function plur/PlurObject.prototype.pureVirtualFunction
 * @throws Error
 */
PlurObject.pureVirtualFunction = function() {
    throw new Error('Unimplmeneted pure virtual function');
};

/**
 * Creates a prototype object; extending it from a parent constructor if provided via Object.create().
 * Injects a namepath variable to the constructor and prototype that provided the namespace + partial file name.
 * Injects an implemented assoc array into the constructor that maintains namepaths of all interfaces implemented.
 * Injects an implements() method into the prototype to check for interface inheritance.
 *
 * @function plur/PlurObject.prototype.create
 * @param string namepath
 * @param Function constructor
 * @param Function parentConstructor
 * @returns {} constructor.prototype
 */
PlurObject.create = function(namepath, constructor, parentConstructor) {
    var prototype = constructor.prototype;

    if (typeof parentConstructor !== 'undefined') {
        prototype = Object.create(parentConstructor.prototype);
        prototype.constructor = constructor;
    }

    // inject namepath on both constructor and prototype
    constructor.namepath = namepath;
    prototype.namepath = constructor.namepath;

    // inject an array that will store namepaths of interfaces as keys into the constructor
    constructor.implemented = {};
    // inject an implements() method into the prototype to reflectively check for implementation
    prototype.implements = PlurObject.implements;
    // inject a model() method into the prototype to convert the object into an intermediate object
    prototype.model =  PlurObject.model;

    return prototype;
};

/**
 * Define a subject constructor/prototype as implementing a given interface constructor.
 * Copies the interface prototype's pure virtual methods in to the subject prototype.
 * Adds the interface pathname to the subject constructor.implemented variable.
 *
 * @function plur/PlurObject.prototype.implement
 * @param function() constructor
 * @param function() interfaceConstructor
 * @returns plur/PlurObject For use in cascaded calls to PlurObject method
 */
PlurObject.implement = function(constructor, interfaceConstructor) {
    if (typeof constructor.implemented[interfaceConstructor.namepath] != 'undefined')
        return;

    let interfacePrototype = interfaceConstructor.prototype;
    let prototype = constructor.prototype;

    for (let propertyName in interfaceConstructor) {
        // make sure that the interface property is assigned to PlurObject.pureVirtualFunction
        if (interfaceConstructor[propertyName] === PlurObject.pureVirtualFunction) {
            let type = prototype[propertyName];

            // set it if it's undefined. ignore if it exists and is already pure virtual. throw error otherwise.
            switch(type) {
            case 'undefined':
                prototype[propertyName] = interfacePrototype[propertyName];
                break;
            default:
                if (prototype[propertyName] !== PlurObject.pureVirtualFunction) {
                    throw new Error('Inheritance collision in ' + prototype.namepath + ' for ' +
                        interfaceConstructor.namepath + '.prototype.' + propertyName);
                }
            }
        }
    }

    constructor.implemented[interfaceConstructor.namepath] = null;
    return PlurObject;
};

/**
 * Creates a simple data model from a variable. Prototypes may define their own .model() method.
 * @param {*} v
 * @param {options=}
 * @returns {Object}
 */
PlurObject.model = function(v, options) {
    let override = ( typeof options !== 'undefined' && options.override === false ? false : true );

    switch(typeof v) {
    case 'string':
    case 'number':
    case 'boolean':
        return v;
        break;

    case 'object':
        if (Array.isArray(v)) {
            // handle arrays
            let model = [];

            // use n as a counter for how many elements have been transformed
            for (let i = 0; i < v.length; ++i) {
                let m = PlurObject.model(v[i], options);
                if (m !== null) {
                    model.push(m);
                }
            }

            return model;
        } else if (!override && Object.hasOwnProperty(v.prototype, 'model') && typeof v.model === 'function')
                return v.model();
        } else {
            // build the model using only public variables
            let model = {};

            for (let propertyName in v)  {
                // only include public variables (starts with a lower case letter)
                if (!propertyName.match(/^[a-z]/)) {
                    continue;
                }

                let m = PlurObject.model(v[propertyName], options);
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

PlurObject.createFromModel = function(model, callback) {
    if (typeof model.namepath === 'undefined') {
        callback(model);
    }

	require([model.namepath], function(constructor) {
	    if (typeof constructor.fromModel === 'function') {
		    let object = constructor.fromModel(model);
		    callback(object);
		} else {
		    let object = new Constructor();

		    for (let propertyName in model) {
                if (!propertyName.match(/^[a-z]/)) {
                    continue;
                }

		        switch(typeof object[propertyName]) {
		            case 'string':
		            case 'number':
		                object[propertyName] = model[propertyName];
		                break;

		            case 'object':
                        //todo:
                        break;
                }
            }
		}
	});
};


return PlurObject;
});
