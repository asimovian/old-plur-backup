/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 */
define(['plur/PlurObject', 'plur/event/Emitter', 'plur/websocket/PlurWebsocket'], function(PlurObject, Emitter, PlurWebsocket) {

var DomWebsocket = function(url, options) {
	PlurWebsocket.call(this);
	
	// set options / default options
	/* -- no options supported yet
	options = ( typeof options === 'undefined' ? {} : options );
	for (var key in PlurWebsocket._defaultOptions)
		options[key] = ( typeof options[key] === 'undefined' ? DomWebsocket._defaultOptions[key] : options[key] );*/

	// create native DOM websocket
	var self = this;
	var ws = new WebSocket(url);
	this._domWebsocket = ws;

	// set event listeners. relay to emitter in proper PlurWebsocket format
	ws.onopen = function() {
		self.emit('open');
	};

	ws.onmessage = function(messageEvent) {
		var data = messageEvent.data;
		try {
			data = JSON.parse(data);
		} catch (e) { /* do nothing */ }

		self.emit('message', data);
	};
	
	ws.onclose = function(closeEvent) {
		var data = { code: closeEvent.code, reason: closeEvent.reason, wasClean: closeEvent.wasClean };
		self.emit('close', data);
	};
	
	ws.onerror = function(errorEvent) {
		self.emit('error');
	};
};


DomWebsocket.prototype = PlurObject.create('web/plur/dom/websocket/DomWebsocket', DomWebsocket, PlurWebsocket);

DomWebsocket.prototype.send = function(data, options) {
	this._domWebsocket.send(JSON.stringify(data));
};

DomWebsocket.prototype.close = function() {
	this._domWebsocket.close();
};

return DomWebsocket;
});