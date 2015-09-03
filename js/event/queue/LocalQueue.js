/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @deprecated
 */
define(['plur/PlurObject','plur/event/Event', 'plur/event/Queue', 'plur/PlurException'], function(PlurObject, Event, Queue) { // no indent
    
var LocalQueue = function() {};

LocalQueue.get = function() {
	if (LocalQueue._instance === null) {
		LocalQueue._instance = new LocalQueue();
	}
	
	return LocalQueue._instance;
};

PlurObject.createClass('plur/event/queue/LocalQueue', LocalQueue, Queue, {});

// hooks
PlurException.prototype._onConstruction = function() {
	var queue = LocalQueue.get();
	if (queue.listening(PlurException.EVENT_TOPIC)) {
		queue.publish(new Event(PlurException.EVENT_TOPIC, { exception: this }));
	}
};

return LocalQueue;
}); // no indent