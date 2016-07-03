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
 * Cryptographic keyset interface.
 *
 * @constructor plur/crypt/IKeyset
 * @interface
 **
 */
var IKeyset = function() { throw new InterfaceError({'this':this}); };

IKeyset.prototype = PlurObject.create('plur/crypt/IKeyset', IKeyset);

IKeyset.prototype.getGenerationTimestamp = PlurObject.abstractMethod;

return IKeyset;
});