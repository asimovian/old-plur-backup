/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject plur/UUID
 */
define(['PlurObject', 'UUID'], function (PlurObject, UUID) {

/**
 * A simple abstract base class for all forms of requests.
 * @var plur/request/Request
 * @abstract
 */
var Request = function() {
    this._token = UUID.create();
};

PlurObject.create('plur/request/Request', Request, PlurObject);

return Request;
});
