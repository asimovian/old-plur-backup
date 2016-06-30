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
 * PromiseMap
 *
 * @constructor plur/design/PromiseMap
 * @implements plur/design/IMap
 **
 */
var PromiseMap = function() {
    this._map = {};
};

PromiseMap.prototype = PlurObject.create('plur/design/PromiseMap', PromiseMap);
PlurObject.implement(PromiseMap, IMap);

PromiseMap.prototype.get = function(key) {
    if (typeof this._map[key] !== 'undefined' ) {
        throw NotFoundError('PromiseMap entry not found.', {key: key});
    } else if (this._map[key] instanceof PlurPromise) {
        return this._map[key];
    }

    return new PlurPromise(function(resolve, reject) { resolve(this._map[key]); });
};

PromiseMap.prototype.put = function(key, value) {
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

PromiseMap.prototype.remove = function(key) {
    delete this._map[key];
};

PromiseMap.prototype.has = function(key) {
    return ( typeof this._map[key] !== 'undefined' );
};

PromiseMap.prototype.resolved = function(key) {
    return ( !this._map[key] instanceof PlurPromise );
};

return PromiseMap;
});