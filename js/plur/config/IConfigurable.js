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
 * Interface for any configurable prototype.
 *
 * @constructor plur/config/IConfigurable
 **
 */
var IConfigurable = function() { throw new InterfaceError({'this': this}; };

IConfigurable.prototype = PlurObject.create('plur/config/IConfigurable', IConfigurable);

IConfigurable.IConstructor.getDefaultConfig = PlurObject.abstractMethod;

IConfigurable.prototype.getConfig = PlurObject.abstractMethod;

IConfigurable.prototype.config = PlurObject.abstractMethod;


return IConfigurable;
});