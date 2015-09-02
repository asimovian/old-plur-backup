define(['plur/PlurObject', function(PlurObject) { // no indent
    
var Event = function(topic, data) {
	this.topic = topic;
	this.data = data;
	this.timestmap = new Date().now();
};

PlurObject.createClass('plur/event/Event', Event, PlurObject, {
    toObj: function() {
    	o = this.prototype.toObj();
    	o.CLASSPATH = this.CLASSPATH;
		o.topic = this.topic;
		o.timestamp = this.timestamp;
		o.data = PlurObject.toObj(data);
    	return o;
    },
    
    toString: function() {
    	return this.message;
    }
}

return Event;
}); // no indent