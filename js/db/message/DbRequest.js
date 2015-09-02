/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 */
define(['plur/request/Request'], function(PlurRequest) { // begin class

var Request = function() {};

Request.CLASSPATH = 'plur/db/Request';

Request.prototype = new PlurRequest();
Request.prototype.constructor = Request;
Request.prototype.CLASSPATH = Request.CLASSPATH;

return Request;
}); //EOF