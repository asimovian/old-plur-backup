define(['plur/PlurObject', 'plur/exception/Exception'], function(PlurObject, Exception) { // no indent
    
var UnsupportedException = function(message) {
	Exception.call(this, message);
};

PlurObject.createClass('plur/exception/UnsupportedException', UnsupportedException, Exception, {});

return UnsupportedException;
}); // no indent