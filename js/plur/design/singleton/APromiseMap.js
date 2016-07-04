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
 * Singleton backed by a Map.
 *
 * @constructor plur/design/APromiseMapSingleton
 * @abstract
 **
 */
var APromiseMapSingleton = function(putFunction) {
    this._map = new PromiseMap();
    this._putFunction = putFunction;
};

APromiseMapSingleton.prototype = PlurObject.create('plur/design/APromiseMapSingleton', APromiseMapSingleton);

/**
 * Retrieves the singleton object.
 *
 * @returns {}
 * @throws plur/Error/State If uninitialized.
 */
APromiseMapSingleton.prototype.get = function(key) {
    if (!this._map.has(key)) {
        this._map.put(this._putFunction());
    }

    return this._map.get(key);
};

return APromiseMapSingleton;
});