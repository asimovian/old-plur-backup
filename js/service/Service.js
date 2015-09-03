/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 */
define(['plur/PlurObject', 'plur/event/Emitter'], function(PlurObject, Emitter) {
	
var Service = function(plurNode, options) {
	if (typeof plurNode === 'undefined')
		throw Error('PlurNode not specified for new: ' + this.namepath);
	
	options = ( typeof options === 'undefined' ? {} : options );
	
	this._emitter = new Emitter();
	this._node = plurNode;
	this._autoStart = ( typeof options.autostart === 'undefined' ? true : options.autostart );
	
	this._emitter.off();
};

Service.prototype = PlurObject.create('plur/service/Service', Service);

Service.prototype.start = function() {
	if (this.running())
		return;
	
	this._emitter.on();
	this._emitter.emit('plur.service.start', { namepath: this.namepath });
};

Service.prototype.stop = function() {
	if (!this.running())
		return;
	
	this._emitter.emit('plur.service.stop', { namepath: this.namepath });
	this._emitter.off();
};

Service.prototype.running = function() {
	return this._emitter.online();
};

Service.prototype.emitter = function() {
	return this._emitter;
};

Service.prototype.getNode = function() {
	return this._node;
};

Service.prototype.shouldAutostart = function() {
	return this._autoStart;
};

return Service;
});