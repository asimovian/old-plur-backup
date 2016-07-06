/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject
 */
define([
    'plur/PlurObject',
    'plur/error/Interface'
    'plur/hash/IHashable' ],
function (
    PlurObject,
    InterfaceError,
    IHashable ) {

/**
 * A simple abstract base class for all messages passed between node and remote services.
 *
 * @constructor plur/msg/IMessage
 * @interface
 **
 */
var IMessage = function() { throw new InterfaceError({'this': this}); };

IMessage.prototype = PlurObject.create('plur/comm/msg/IMessage', IMessage);


return Message;
});