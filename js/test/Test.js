/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 */
define(function() { // no indent

var Test = function(callback) {
	this._callback = callback;
};

Test.CLASSPATH = 'plur/test/Test';
Test.PASS = 'pass';
Test.FAIL = 'fail';

Test.prototype = {
    CLASSPATH: Test.CLASSPATH,
    
    pass: function(method) {
    	this._callback(this.CLASSPATH, method, Test.PASS);
    },
    
    fail: function(method) {
    	this._callback(this.CLASSPATH, method, Test.FAIL);
    }
};

return Test;
}); // no indent