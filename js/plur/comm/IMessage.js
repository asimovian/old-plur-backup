/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject
 */
define([
    'plur/PlurObject',
    'plur/error/Interface' ],
function (
    PlurObject,
    InterfaceError ) {

/**
 * A simple abstract base class for all messages passed between node and remote services.
 *
 * @constructor plur/msg/IMessage
 * @interface
 **
 */
var IMessage = function() { throw new InterfaceError({'this': this}); };

IMessage.prototype = PlurObject.create('plur/msg/IMessage', IMessage);

IMessage.prototype.getRecipientPublicKeyHash = PlurObject.abstractMethod;

IMessage.prototype.getSenderPublicKeyHash = PlurObject.abstractMethod;

IMessage.prototype.getHash = PlurObject.abstractMethod;

return Message;
});