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
 * Runtime Config Set Singleton
 *
 * @constructor plur/config/set/runtime/Singleton
 **
 */
var RuntimeConfigSetSingleton = function() {
    ASingleton.call(this, new RuntimeConfig());
};

RuntimeConfigSetSingleton.prototype = PlurObject.create('plur/config/set/runtime/Singleton', RuntimeConfigSetSingleton, ASingleton);

return new RuntimeConfigSetSingleton();
});