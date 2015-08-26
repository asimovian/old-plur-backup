/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject lib/broofa/node-uuid/uuid.js
 */
define(['plur/PlurObject', 'lib/broofa/node-uuid/uuid.js'], function(PlurObject, broofaUUID) {

/**
 * Provides UUIDs using the best RNGs available.
 * Currently uses broofa/node-uuid internally.
 *
 * @var plur/
 * @singleton
 **
 * @function plur/UUID
 */
var UUID = function() {};

UUID.prototype = PlurObject.create('plur/UUID', UUID);

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
 * @var UUID plur/UUID.singleton
 */
UUID.singleton = new UUID();

return UUID.singleton;
});
