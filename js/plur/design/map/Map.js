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
 * Map
 *
 * @constructor plur/design/Map
 * @implements plur/design/IMap
 **
 */
var Map = function() {
    this._map = {};
};

Map.prototype = PlurObject.create('plur/design/Map', Map);
PlurObject.implement(Map, IMap);

Map.prototype.get = function(key) {
    if (typeof this._map[key] !== 'undefined' ) {
        throw NotFoundError('Map entry not found.', {key: key});
    }

    return this._map[key];
};

Map.prototype.put = function(key, value) {
    this._map[key] = value;
};

Map.prototype.remove = function(key) {
    delete this._map[key];
};

Map.prototype.has = function(key) {
    return ( typeof this._map[key] !== 'undefined' );
};

return Map;
});