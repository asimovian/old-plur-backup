/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject
 */
 'use strict';

define([
    'plur/PlurObject',
    'plur/hash/Hash',
    'plur/design/Singleton' ],
function(
    PlurObject,
    Hash,
    Singleton ) {

/**
 * Singleton container for Hash.
 *
 * @constructor plur/hash/HashSingleton
 * @extends plur/design/Singleton
 **
 */
var HashSingleton = function() {
    Singleton.call(this, new Hash());
};

HashSingleton.prototype = PlurObject.create('plur/hash/HashSingleton', HashSingleton, Singleton);

HashSingleton.prototype.IHashable = Hash.IHashable;

return new HashSingleton();
});
