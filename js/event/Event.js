/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @deprecated
 * @requires plur/PlurObject
 */
define(['plur/PlurObject', function(PlurObject) {
    
var Event = function(topic, data) {
	this.topic = topic;
	this.data = data;
	this.timestamp = new Date().now();
};

Event.prototype = PlurObject.create('plur/event/Event', Event);

Event.prototype.toObj = function() {
    o = this.prototype.toObj();
    o.namepath = this.namepath;
    o.topic = this.topic;
    o.timestamp = this.timestamp;
    o.data = PlurObject.toObj(data);
    return o;
};
    
return Event;
});