/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject plur/UUID
 */
define(['plur/PlurObject', 'plur/rng/UUID'], function (PlurObject, UUID) {

/**
 * A simple abstract base class for all messages passed between node and remote services.
 *
 * @constructor plur/msg/Message
 * @abstract
 */
var Message = function() {
};

PlurObject.create('plur/msg/Message', Message);

/**
 * Retrieves the message identifier.
 *
 * @function plur/msg/Message.prototype.getId
 * @virtual
 * @returns string
 */
Message.prototype.getId = PlurObject.pureVirtualFunction;

return Message;
});