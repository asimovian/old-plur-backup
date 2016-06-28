/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject plur/msg/Message plur/UUID
 */
define([
    'plur/PlurObject',
    'plur/msg/Message',
    'plur/rng/UUID' ],
function (
    PlurObject,
    IMessage,
    UUID ) {

/**
 * A simple abstract base class for all forms of responses from requests.
 *
 * @constructor plur/msg/Response
 * @implements plur/msg/IMessage
 * @abstract
 */
var Response = function(senderPublicKeyHash, recipientPublicKeyHash, requestId, data) {
    AMessage.call(this, senderPublicKeyHash, recipientPublicKeyHash, data);

    this._requestId = requestId;
};

Response.prototype = PlurObject.create('plur/msg/Response', Response, AMessage);

return Response;
});