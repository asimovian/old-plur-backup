/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject
 */
 'use strict';

define([
    'plur/PlurObject',
    'plur/error/Interface' ],
function(
    PlurObject,
    InterfaceError ) {

/**
 * Hash interface
 *
 * @constructor plur/hash/IHashable
 * @interface
 **
 */
var IHashable = function() { throw new InterfaceError({'this': this})};

IHashable.prototype = PlurObject.create('plur/hash/IHashable', IHashable);

IHashable.prototype.hash = PlurObject.abstractMethod;

return IHashable;
});