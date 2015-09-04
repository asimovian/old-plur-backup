/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject plur/request/Request
 */
define(['plur/PlurObject', 'plur/request/Request'], function(PlurObject, Request) {

/**
 * ABC for DB requests.
 *
 * @constructor plur/db/msg/Request
 * @abstract
 */
var DbRequest = function() {
};

DbRequest.prototype = PlurObject.create('plur/db/msg/Request', DbRequest);

return DbRequest;
});
