/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires jquery plur/request/Client
 */
define(['jquery', 'plur/request/Client'], function(jQuery, PlurRequestClient) {

/**
 *
 * @constructor plur/jquery/request/client/JqueryRequestClient
 * @extends plur/request/Client
 **
 * @param string url
 */
var JqueryRequestClient = function(url) {
    this._url = url;
};

JqueryRequestClient.prototype = PlurObject.create('plur/request/client/JqueryRequestClient',
                                                    JqueryRequestClient,
                                                    RequestClient );

/**
 * Sends a Request message (via JSON) to the request's URL; returning the response via callback.
 *
 * @function plur/message/request-client/JqueryRequestClient.prototype.send
 * @param plur/message/Request request
 * @param function({} data) callback
 */
JqueryRequestClient.prototype.send = function(request, callback) {
    var json = JSON.stringify(request.toObj());

    jQuery.getJSON(this._url, json, function(data, textStatus, jqXHR) {
        callback(data);
    });
};

return JqueryRequestClient;
});

