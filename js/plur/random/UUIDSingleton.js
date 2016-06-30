/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject plur/lib/broofa/node-uuid/uuid.js
 */
define(['plur/PlurObject', 'plur/lib/broofa/node-uuid/uuid.js'], function(PlurObject, broofaUUID) {

/**
 * Provides UUIDs.
 * Currently uses broofa/node-uuid internally.
 *
 * @var plur/random/UUID
 **
 * @function plur/random/UUID
 */
var UUID = function() {};

UUID.prototype = PlurObject.create('plur/random/UUID', UUID);

/**
 * Creates an RFC4122 Version 4 UUID.
 *
 * @function plur/UUID.prototype.create
 * @returns string
 */
UUID.prototype.create = function() {
    return broofaUUID.v4();
};


return new UUID();
});
