/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject plur/msg/Message plur/UUID
 */
define([
    'plur/PlurObject',
    'plur/msg/Message',
    'plur/rng/UUID'],
function (
    PlurObject,
    Message,
    UUID ) {

/**
 * A simple abstract base class for all forms of requests.
 *
 * @constructor plur/msg/Request
 * @extends plur/msg/Message
 * @abstract
 */
var Request = function() {
    this._id = UUID.create();
};

Request.prototype = PlurObject.create('plur/msg/Request', Request, Message);

/**
 * Retrieves the request identifier.
 *
 * @function Request.prototype.getId
 * @returns string
 */
Request.prototype.getId = function() {
    return this._id;
};

return Request;
});
