/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject
 */
define(['plur/PlurObject'], function(PlurObject) {

/**
 * The Directive abstract class represents service operations that are required to succeed at a given level within a
 * Plur Cloud.
 *
 * @constructor plur/directive/Directive
 * @abstract
 **
 * @param {} options Configuration parameters {
 *     plur/directive/Directive[] | undefined requirements Sub-component directives
 * }
 */
var Directive = function(options) {
    this._requirementDirectives = ( typeof options.requirements !== 'undefined' ? options.requirements : [] )
};

Directive.prototype = PlurObject.create('plur/directive/Directive', Directive);

/**
 * Retrieves the child component directives that must be operable for this directive to succeed.
 *
 * @function plur/directive/Directive.prototype.getRequirements
 * @returns Directive[]
 */
Directive.prototype.getRequirements = function() {
    return this._requirementDirectives;
};

return Directive;
});