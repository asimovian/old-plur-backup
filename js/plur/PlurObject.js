/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires requirejs
 */
 'use strict';

define([
    'require'],
function(
    requirejs ) {

/**
 * Utility for prototype object construction.
 *
 * @constructor plur/PlurObject
 * @private
 */
var PlurObject = function() {
    throw Error('Cannot instantiate private constructor of PlurObject');
};

// Standardize PlurObject
PlurObject.namepath = 'plur/PlurObject';
PlurObject.prototype.namepath = PlurObject.namepath;


/**
 * Determines whether the given function is a valid PlurObject constructor.
 *
 * @function PlurObject.isConstructor
 * @param Function constructor
 * @returns boolean TRUE if constructor FALSE if not
 */
PlurObject.isConstructor = function(constructor) {
    return ( constructor instanceof Function && typeof constructor.namepath !== 'undefined' );
};


PlurObject.implementing = function(object, interfaceConstructor) {
    var constructor = Object.getPrototypeOf(object).constructor;
    return ( typeof constructor.implemented !== 'undefined'
            && typeof constructor.implemented[interfaceConstructor.namepath] !== 'undefined' );
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
 * Injects an implementing() method into the prototype to check for interface inheritance.
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
    if (typeof constructor.implemented[interfaceConstructor.namepath] !== 'undefined')
        return;

    var interfacePrototype = interfaceConstructor.prototype;
    var prototype = constructor.prototype;

    for (var propertyName in interfacePrototype) {
        // make sure that the interface property is assigned to PlurObject.pureVirtualFunction
        if (interfacePrototype[propertyName] === PlurObject.pureVirtualFunction) {
            // set it if it's undefined. ignore if it exists and is already pure virtual. throw error otherwise.
            switch(typeof prototype[propertyName]) {
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

PlurObject.values = function(object) {
    var values = [];
    for (var key in object) {
        values.push(object[key]);
    }

    return values;
};

return PlurObject;
});
