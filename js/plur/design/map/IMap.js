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
 * Map interface
 *
 * @constructor plur/design/map/IMap
 **
 */
var IMap = function() {
};

IMap.prototype = PlurObject.create('plur/design/map/IMap', IMap);

return IMap;
});