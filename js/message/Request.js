define(function() { // no-indent

/**
 * A simple abstract base class for all forms of requests.
 * @var class plur/request/Request #abstract
 */
var Request = function() {
    this._token = ++Request._nextToken;
};

Request._nextToken = 0;
Request.CLASSPATH = 'plur/request/Request';

PlurObject.createClass('plur/request/Request', Request, PlurObject {});

return Request;
}); // no-indent
