/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject plur/msg/Message plur/UUID
 */
define(['plur/PlurObject', 'plur/msg/Message', 'plur/rng/UUID'], function (PlurObject, Message, UUID) {

/**
 * A simple abstract base class for all forms of responses from requests.
 *
 * @constructor plur/msg/Response
 * @extends plur/msg/Message
 * @abstract
 */
var Response = function() {
    this._id = UUID.create();
};

Response.prototype = PlurObject.create('plur/msg/Response', Response, Message);

/**
 * Retrieves the response identifier.
 *
 * @function Response.prototype.getId
 * @returns string
 */
Response.prototype.getId = function() {
    return this._id;
};

return Response;
});