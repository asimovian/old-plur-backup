/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject plur/msg/Message plur/UUID
 */
define([
    'plur/PlurObject',
    'plur/msg/Message' ],
function (
    PlurObject,
    IMessage ) {

/**
 * A simple abstract base class for all forms of responses from requests.
 *
 * @constructor plur/msg/AResponse
 * @extends plur/msg/AMessage
 */
var AResponse = function(senderPublicKeyHash, recipientPublicKeyHash) {
    AMessage.call(this, senderPublicKeyHash, recipientPublicKeyHash);
};

AResponse.prototype = PlurObject.create('plur/comm/msg/AResponse', AResponse, AMessage);

return AResponse;
});