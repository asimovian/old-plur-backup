/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 */
define(['plur/PlurObject','plur/event/Event'], function(PlurObject, Event) { // no indent
    
var Queue = function() {
	this.subscribers = [];
};

Queue.Subscriber = function(name, topic, callback) {
	this.name = name;
	this.topic = topic;
	this.callback = callback;
};

PlurObject.createClass('plur/event/Queue', Queue, PlurObject, {
	subscribe: function(name, topics, callback) {
		if (!Array.isArray(topics))
			topics = [topics];
		
		this.unsubscribe(name);
		
		for (var i = 0, n = topics.length; i < n; ++i) {
			this.subscribers.push(new Subscriber(name, topics[i], callback);
		}
	},
	
	unsubscribe: function(name) {
		for (var i = 0, n = this.subscribers.length; i < n; ++i) {
			if (this.subcribers[i].name === name) {
				this.subscribers.splice(i, 1);
			}
		}
	},
	
	listening: function(topic) {
		for (var i = 0, n = this.subscribers.length; i < n; ++i) {
			if (this.subcribers[i].topic === event.topic) {
				return true;
			}
		}
		
		return false;
	},
	
	publish: function(event) {
		for (var i = 0, n = this.subscribers.length; i < n; ++i) {
			if (this.subcribers[i].topic === event.topic) {
				this.subscribers[i].callback(event);
			}
		}
	},
	
	_findSubscriber: function(name) {
		for (var i = 0, n = this.subscribers.length; i < n; ++i) {
			if (this.subcribers[i].name === name)
				return this.subscribers[i];
		}
		
		return null;
	}
});

return Queue;
}); // no indent