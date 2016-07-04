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
 * Constructor Config - Template.
 *
 * @constructor plur/config/Constructor
 **
 */
var ConstructorConfig = function(configured, configuredParent, fileConfigModel, config) {
};

ConstructorConfig.prototype = PlurObject.create('plur/config/Constructor', ConstructorConfig);

return ConstructorConfig;
});