/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 */
define(['plur/websocket/Websocket'], function(Websocket) {

var DojoWebsocket = function(dojoWebsocket) {
	this._dojoWebsocket = dojoWebsocket;
	
	var self = this;
	dojoWebsocket.once('open', function() {
		self.emit('open');
	});
	
	dojoWebsocket.on('message', function(event) {
		self.emit('message', event.data);
	});
	
	dojoWebsocket.on('close', function() {
		self.emit('close');
	});
	
	dojoWebsocket.on('error', function(event) {
		self.emit('error', event.data);
	});
};

DojoWebsocket.prototype = Object.create(WebsocketEmitter.prototype);
DojoWebsocket.prototype.constructor = DojoWebsocket;

DojoWebsocket.prototype.send = function(data, options) {
	this._dojoWebsocket.send(data);
};

DojoWebsocket.prototype.close = function() {
	this._dojoWebsocket.close();
};

return Websocket;
});