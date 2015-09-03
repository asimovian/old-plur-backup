/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 */
define(['jquery', 'plur/request/Client'], function(jQuery, PlurRequestClient) { // begin

var Jquery = function(url) {
    this._url = url;
};

Jquery.namepath = 'plur/request/client/Jquery';
Jquery.prototype = new PlurRequestClient();
Jquery.prototype.constructor = Jquery;
Jquery.prototype.namepath = Jquery.namepath;

Jquery.prototype.send = function(request, callback) {
    var json = JSON.stringify(request.toObj());
    jQuery.getJSON(this._url, json, function(data, textStatus, jqXHR) {
        callback(data);
    });
};

return Jquery;
}); // EOF
