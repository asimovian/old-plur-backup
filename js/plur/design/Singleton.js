/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject
 */
 'use strict';

define([
    'plur/PlurObject',
    'plur/error/State' ],
function(
    PlurObject,
    PlurStateError ) {

/**
 * Acts as singleton wrapper for other prototypes.
 *
 * Intended for use in cases where parent prototype design should be separate from singleton implementation.
 *
 * For example; the SystemLog singleton is intended for use as a default logger whereas the Log prototype that it
 * wraps is intended for logging within any context, not just within the default "System" scope. While the design
 * of the SystemLog singleton is, obviously, singular, the design of the Log prototype is not.
 *
 * Other singleton patterns, such as the static singleton, are more appropriate when the design of the prototype
 * is intended for use with single concrete implementation.
 *
 * For example; the Bootstrap prototype is designed to work with a single platform globally. While many different types
 * of platform-specific implementations may be defined, only a single implementation will be used at runtime. A static
 * singleton is more appropriate here as the intentions of the prototype and implementation are both singular
 * in nature.
 *
 * By convention, when referencing singleton prototypes with require() / define(), the variable name should be prefixed
 * with a 'g' and suffixed with the word 'Singleton'.
 *
 * @constructor plur/design/Singleton
 * @abstract
 **
 */
var Singleton = function(object) {
    this.object = null;

    if (typeof object === 'object') {
        this.set(object);
    }
};

Singleton.prototype = PlurObject.create('plur/design/Singleton', Singleton);

/**
 * Sets the singleton object.
 *
 * @function plur/design/Singleton.prototype.set
 * @param {} object
 * @throws plur/error/State If the singleton object has already bee initialized
 */
Singleton.prototype.set = function(object) {
    if (this.object !== null) {
        throw new PlurStateError('Singleton for ' + this.namepath + ' has already been initialized');
    }

    this.object = object;

    var self = this;
    this.object.getSingleton = function() { return self; };
};

/**
 * Retrieves the singleton object.
 *
 * @returns {}
 * @throws plur/Error/State If uninitialized.
 */
Singleton.prototype.get = function() {
    if (this.object === null) {
        throw new PlurStateError('Singleton for ' + this.namepath + ' has not been initialized');
    }

    return this.object;
};

return Singleton;
});