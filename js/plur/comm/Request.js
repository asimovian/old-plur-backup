/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject plur/msg/Message plur/UUID
 */
define([
    'plur/PlurObject',
    'plur/msg/AMessage' ],
function (
    PlurObject,
    AMessage ) {

/**
 * A simple abstract base class for all forms of requests.
 *
 * @constructor plur/msg/Request
 * @implements plur/msg/IMessage
 * @abstract
 */
var Request = function(senderPublicKeyHash, recipientPublicKeyHash, data) {
    AMessage.call(this, senderPublicKeyHash, recipientPublicKeyHash, data);
};

Request.prototype = PlurObject.create('plur/msg/Request', Request, AMessage);

return Request;
});
