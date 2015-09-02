/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 */
define(['plur/PlurObject', function(PlurObject) { // no indent
    
var PlurException = function(message) {
	this.message = ''+message;
	this._onConstruction();
};

PlurException.EVENT_TOPIC = 'exception';

PlurException.fromObj = function(obj, instance) {
	if (typeof instance === 'undefined') {
		instance = new PlurException(obj.message);
	} else {
		instance.message = obj.message;
	}
	
	return instance;
};

PlurObject.createClass('plur/exception/PlurException', PlurException, PlurObject, {
    toObj: function() {
    	o = this.prototype.toObj();
    	o.CLASSPATH = this.CLASSPATH;
		o.message = this.message;
    	return o;
    },
    
    toString: function() {
    	return this.message;
    }
}

return PlurException;
}); // no indent