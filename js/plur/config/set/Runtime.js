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
 * Runtime Config Set
 *
 * @constructor config/Runtime
 **
 */
var RuntimeConfigSet = function() {
};

RuntimeConfigSet.prototype = PlurObject.create('config/set/Runtime', RuntimeConfigSet);

return Runtime;
})