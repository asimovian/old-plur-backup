/**
 * @copyright 2016 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @module plur
 */
 'use strict';

define([
    'plur/IPlurified' ],
function(
    IPlurified ) {

/**
 * Utility for prototype object construction.
 *
 * @implements {plur/IPlurified}
 */
class PlurObject {
    static hasPlurPrototype(object) {
        return ( typeof object.namepath === 'string' );
    };

    /**
     * Determines whether the given function is a valid PlurObject constructor.
     *
     * @param {Function} constructor
     * @returns {boolean} TRUE if constructor FALSE if not
     */
    static isConstructor(constructor) {
        return ( constructor instanceof Function && typeof constructor.namepath === 'string'
            && typeof constructor.prototype === 'object' );
    };

    /**
     *
     * @param {plur/IPlurified} object
     * @param {function(new: plur/IPlurified)} interfaceConstructor
     * @returns {boolean}
     */
    static implementing(object, interfaceConstructor) {
        let constructor = Object.getPrototypeOf(object).constructor;
        if (typeof constructor.implemented === 'undefined') {
            return false;
        } else if (typeof interfaceConstructor === 'string') {
            return ( typeof constructor.implemented[interfaceConstructor] !== 'undefined' );
        } else {
            return ( typeof constructor.implemented[interfaceConstructor.namepath] !== 'undefined' );
        }
    };

    /**
     * Meant to be assigned to abstract prototype functions that require overriding in child classes.
     *
     * @throws Error
     */
    static abstractMethod() {
        throw new Error('plur: Cannot call abstract method.');
    };

    /**
     * Creates a prototype object; extending it from a parent constructor if provided via Object.create().
     * Injects a namepath variable to the constructor and prototype that provided the namespace + partial file name.
     * Injects an implemented assoc array into the constructor that maintains namepaths of all interfaces implemented.
     *
     * @param {string} namepath
     * @param {class} constructor
     * @param {IPlurified.prototype.constructor} parentConstructor
     * @returns {{}} constructor.prototype
     */
    static create(namepath, constructor, parentConstructor) {
        let prototype = constructor.prototype;

        if (typeof parentConstructor !== 'undefined') {
            prototype = Object.create(parentConstructor.prototype);
            prototype.constructor = constructor;
        }

        // inject namepath on both constructor and prototype
        Object.defineProperty(constructor, 'namepath', { value: namepath });
        prototype.namepath = namepath;

        // inject an array that will store namepaths of interfaces as keys into the constructor
        Object.defineProperty(constructor, 'implemented', { value: {'plur/IPlurified' : IPlurified } });

        return prototype;
    };

    /**
     * Initializes a class as a Plur Object.
     *
     * Designed to be used from within a ES6+ class declaration. Always assigned to a static property "namepath".
     *
     *** Example usage:
     * class Foo {
     *   ...
     * };
     *
     * PlurObject.plurify('myproject/foobars/Foo', Foo);
     ***
     *
     * Sets the provided "namepath" property into the prototype of the provided constructor.
     *
     * Sets the "implemented" property into the constructor that maps implemented interface namepaths
     * to their constructors.
     *
     * @param {string} namepath The namepath to set both statically and on the prototype.
     * @param {class} constructor The constructor to be plurified
     * @param {function(new: plur/IPlurified)[]} [ifaces] Interfaces to be implemented.
     * @returns {string} namepath
     */
    static plurify(namepath, constructor, ifaces) {
        // inject namepath on the prototype.
        Object.defineProperty(constructor, 'namepath', { value: namepath });
        Object.defineProperty(constructor.prototype, 'namepath', { value: namepath });
        constructor.implemented = { 'plur/IPlurified' : IPlurified };

        if (typeof ifaces === 'undefined') {
            return namepath;
        }

        // implement interfaces
        if (!Array.isArray(ifaces)) {
            ifaces = [ifaces];
        }

        for (let i = 0; i < ifaces.length; ++i) {
            PlurObject.implement(constructor, ifaces[i]);
        }

        return namepath; // returned for the static namepath property
    };

    /**
     * Define a subject constructor/prototype as implementing a given interface constructor.
     * Copies the interface prototype's abstract methods in to the subject prototype.
     * Adds the interface pathname to the subject constructor.implemented variable.
     *
     * @param {plur/IPlurified.prototype.constructor} constructor
     * @param {plur/IPlurified.prototype.constructor} interfaceConstructor
     * @returns {plur/PlurObject|null} For use in cascaded calls to PlurObject method
     * @throws {Error}
     */
    static implement(constructor, interfaceConstructor) {
        if (typeof constructor.implemented[interfaceConstructor.namepath] !== 'undefined') {
            throw new Error('Not a valid plur Object.');
        }

        let interfacePrototype = interfaceConstructor.prototype;
        let prototype = constructor.prototype;

        for (let propertyName in interfacePrototype) {
            // make sure that the interface property is assigned to PlurObject.abstractMethod
            if (interfacePrototype.hasOwnProperty(propertyName) && interfacePrototype[propertyName] === PlurObject.abstractMethod) {
                // set it if it's undefined. ignore if it exists and is already abstract. throw error otherwise.
                switch (typeof prototype[propertyName]) {
                    case 'undefined':
                        prototype[propertyName] = interfacePrototype[propertyName];
                        break;
                    default:
                        if (prototype[propertyName] === PlurObject.abstractMethod) {
                            throw new Error('Unimplemented method in ' + prototype.namepath + ' for ' +
                                interfaceConstructor.namepath + '.prototype.' + propertyName);
                        }
                }
            }
        }

        constructor.implemented[interfaceConstructor.namepath] = null;
        return constructor;
    };

    /**
     *
     * @param {{}} object
     * @returns {{}[]}
     */
    static values(object) {
        let values = [];
        for (let key in object) {
            if (object.hasOwnProperty(key)) {
                values.push(object[key]);
            }
        }

        return values;
    };

    constructor() {
        throw new Error('Cannot instantiate private constructor of PlurObject');
    };
}

PlurObject.plurify('plur/PlurObject', PlurObject);

return PlurObject;
});
