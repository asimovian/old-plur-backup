/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject plur/request/Request
 */
define(['plur/PlurObject', 'plur/request/Request'], function(PlurObject, Request) {

/**
 * ABC for DB requests.
 *
 * @constructor plur/db/message/DbRequest
 * @abstract
 */
var DbRequest = function() {
};

DbRequest.prototype = PlurObject.create('plur/db/message/DbRequest', DbRequest);

return DbRequest;
});
