/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject
 */
 'use strict';

define([
    'plur/PlurObject' ],
function(
    PlurObject ) {

/**
 * FutureMap
 *
 * @constructor plur/design/FutureMap
 * @implements plur/design/IMap
 **
 */
var FutureMap = function() {
    this._map = {};
};

FutureMap.prototype = PlurObject.create('plur/design/FutureMap', FutureMap);
PlurObject.implement(FutureMap, IMap);

FutureMap.prototype.get = function(key) {
    if (typeof this._map[key] !== 'undefined' ) {
        throw NotFoundError('FutureMap entry not found.', {key: key});
    } else if (this._map[key] instanceof PlurPromise) {
        return this._map[key];
    }

    return new PlurPromise(function(resolve, reject) { resolve(this._map[key]); });
};

FutureMap.prototype.put = function(key, value) {
    this._map[key] = value;

    if (value instanceof PlurPromise) {
        var self = this;
        value.then(
            function(resolvedValue) {
                self._map[key] = resolvedValue;
            }, function(error) {
                delete self._map[key];
            }
        );
    }
};

FutureMap.prototype.remove = function(key) {
    delete this._map[key];
};

FutureMap.prototype.has = function(key) {
    return ( typeof this._map[key] !== 'undefined' );
};

FutureMap.prototype.resolved = function(key) {
    return ( !this._map[key] instanceof PlurPromise );
};

return FutureMap;
});