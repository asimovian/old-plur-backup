define(['jquery', 'plur/request/Client'], function(jQuery, PlurRequestClient) { // begin

var Jquery = function(url) {
    this._url = url;
};

Jquery.CLASSPATH = 'plur/request/client/Jquery';
Jquery.prototype = new PlurRequestClient();
Jquery.prototype.constructor = Jquery;
Jquery.prototype.CLASSPATH = Jquery.CLASSPATH;

Jquery.prototype.send = function(request, callback) {
    var json = JSON.stringify(request.toObj());
    jQuery.getJSON(this._url, json, function(data, textStatus, jqXHR) {
        callback(data);
    });
};

return Jquery;
}); // EOF
