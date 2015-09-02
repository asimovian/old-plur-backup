/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject plur/lib/broofa/node-uuid/uuid.js
 */
define(['plur/PlurObject', 'plur/lib/broofa/node-uuid/uuid.js'], function(PlurObject, broofaUUID) {

/**
 * Provides UUIDs using the best RNGs available.
 * Currently uses broofa/node-uuid internally.
 *
 * @var plur/rng/UUID
 **
 * @function plur/rng/UUID
 */
var UUID = function() {};

UUID.prototype = PlurObject.create('plur/rng/UUID', UUID);

/**
 * Creates an RFC4122 Version 4 UUID.
 *
 * @function plur/UUID.prototype.create
 * @returns string
 */
UUID.prototype.create = function() {
    return broofaUUID.v4();
};

/**
 * @var UUID plur/rng/UUID.singleton
 */
UUID.singleton = new UUID();

return UUID.singleton;
});
