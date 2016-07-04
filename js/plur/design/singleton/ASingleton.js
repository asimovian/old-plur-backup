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
 * with a 'g' and suffixed with the word 'ASingleton'.
 *
 * @constructor plur/design/ASingleton
 * @abstract
 **
 */
var ASingleton = function(object) {
    this._object = null;

    if (typeof object === 'object') {
        this._set(object);
    }
};

ASingleton.prototype = PlurObject.create('plur/design/ASingleton', ASingleton);
PlurObject.implement(ASingleton, ISingleton);

/**
 * Sets the singleton object.
 *
 * @function plur/design/ASingleton.prototype._set
 * @param {} object
 * @throws plur/error/State If the singleton object has already bee initialized
 */
ASingleton.prototype._set = function(object) {
    if (this._object !== null) {
        throw new ExistsError('Singleton for ' + this.namepath + ' has already been initialized');
    }

    this._object = object;

    var self = this;
    this._object.getASingleton = function() { return self; };
};

/**
 * Resets the singleton object.
 *
 * @function plur/design/ASingleton.prototype._reset
 * @param {} object
 * @throws plur/error/State If the singleton object has already bee initialized
 */
ASingleton.prototype._reset = function(object) {
    if (this._object !== null) {
        delete this._object.getSingleton;
    }

    this._object = object;

    var self = this;
    this._object.getSingleton = function() { return self; };
};

/**
 * Retrieves the singleton object.
 *
 * @returns {}
 * @throws plur/Error/State If uninitialized.
 */
ASingleton.prototype.get = function() {
    if (this._object === null) {
        throw new UninitializedError('Singleton for ' + this.namepath + ' has not been initialized');
    }

    return this._object;
};

return ASingleton;
});