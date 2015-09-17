/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires require
 */
 'use strict';

define([
    'requirejs'],
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

PlurObject.implements = function(interfaceConstructor, object) {
    var o = ( object || this );
    return ( typeof o.prototype.implements !== 'undefined'
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

    var interfacePrototype = interfaceConstructor.prototype;
    var prototype = constructor.prototype;

    for (var propertyName in interfaceConstructor) {
        // make sure that the interface property is assigned to PlurObject.pureVirtualFunction
        if (interfaceConstructor[propertyName] === PlurObject.pureVirtualFunction) {
            var type = prototype[propertyName];

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




return PlurObject;
});
