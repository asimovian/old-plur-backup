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
 * @constructor plur/msg/ANotification
 * @extends plur/msg/AMessage
 */
var ANotification = function(senderPublicKeyHash, recipientPublicKeyHash) {
    AMessage.call(this, senderPublicKeyHash, recipientPublicKeyHash);
};

ANotification.prototype = PlurObject.create('plur/comm/msg/ANotification', ANotification, AMessage);

return ANotification;
});
