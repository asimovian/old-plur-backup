/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 */
define([], function() {

/**
 * Utility for prototype object construction.
 *
 * @constructor plur/PlurObject
 */
var PlurObject = function() {};

// Standardize PlurObject
PlurObject.namepath = 'plur/PlurObject';
PlurObject.prototype.namepath = PlurObject.namepath;

PlurObject.implements = function(interfaceConstructor) {
    return ( typeof this.prototype.implements !== 'undefined' &&
            && typeof this.prototype.implements[interfaceConstructor.namepath] !== 'undefined' );
};

/**
 * Meant to be assigned to abstract prototype functions that require overriding in child classes.
 *
 * @function plur/PlurObject.prototype.pureVirtualFunction
 * @throws Error
 */
PlurObject.prototype.pureVirtualFunction = function() {
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
PlurObject.prototype.create = function(namepath, constructor, parentConstructor) {
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
    // inject an implements() method into the prototype
    prototype.implements = PlurObject.implements;

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
 * @returns plur/PlurObject For use in cascaded calls to this method
 */
PlurObject.prototype.implement = function(constructor, interfaceConstructor) {
    if (typeof constructor.implemented[interfaceConstructor.namepath] != 'undefined')
        return;

    let interfacePrototype = interfaceConstructor.prototype;
    let prototype = constructor.prototype;

    for (let propertyName in interfaceConstructor) {
        // make sure that the interface property is assigned to PlurObject.pureVirtualFunction
        if (interfaceConstructor[propertyName] === this.pureVirtualFunction) {
            let type = prototype[propertyName];

            // set it if it's undefined. ignore if it exists and is already pure virtual. throw error otherwise.
            switch(type) {
            case 'undefined':
                prototype[propertyName] = interfacePrototype[propertyName];
                break;
            default:
                if (prototype[propertyName] !== this.pureVirtualFunction) {
                    throw new Error('Inheritance collision in ' + prototype.namepath + ' for ' +
                        interfaceConstructor.namepath + '.prototype.' + propertyName);
                }
            }
        }
    }

    constructor.implemented[interfaceConstructor.namepath] = null;
    return this;
};

/**
 * @var PlurObject plur/PlurObject.singleton
 */
PlurObject.singleton = new PlurObject();

return PlurObject.singleton;
});
