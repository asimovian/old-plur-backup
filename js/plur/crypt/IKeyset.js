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
 * Cryptographic keyset interface.
 *
 * @constructor plur/crypt/IKeyset
 **
 */
var IKeyset = function() {
};

IKeyset.prototype = PlurObject.create('plur/crypt/IKeyset', IKeyset);

return IKeyset;
});