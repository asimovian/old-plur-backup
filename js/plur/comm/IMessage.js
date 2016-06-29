/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject
 */
define([
    'plur/PlurObject' ],
function (
    PlurObject ) {

/**
 * A simple abstract base class for all messages passed between node and remote services.
 *
 * @constructor plur/msg/IMessage
 * @interface
 **
 */
var IMessage = function() {};

IMessage.prototype = PlurObject.create('plur/msg/IMessage', IMessage);

/**
 * Retrieves the message identifier.
 *
 * @function plur/msg/IMessage.prototype.getId
 * @abstract
 * @returns string
 */
IMessage.prototype.getId = PlurObject.abstractMethod;

IMessage.prototype.getRecipientPublicKeyHash = PlurObject.abstractMethod;

IMessage.prototype.getSenderPublicKeyHash = PlurObject.abstractMethod;

return Message;
});