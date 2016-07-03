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
 * @constructor plur/config/IConfigured
 **
 */
var IConfigured = function() { throw new InterfaceError({'this': this}; };

IConfigured.prototype = PlurObject.create('plur/config/IConfigured', IConfigured);

IConfigured.IConstructor.getDefaultConfig = PlurObject.abstractMethod;

IConfigured.IConstructor.getConfigs = PlurObject.abstractMethod;

IConfigured.prototype.getConfig = PlurObject.abstractMethod;

IConfigured.prototype.config = PlurObject.abstractMethod;


return IConfigured;
});