/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 */
define([
    'ws',
    'plur/PlurObject',
    'plur/service/Service',
    'plur/websocket/WebsocketService',
    'plur/websocket/WebsocketSession'],
function(
    ws,
    PlurObject,
    Service,
    WebsocketService,
    WebsocketSession ) {

var WebsocketServerService = function(plurNode) {
	Service.call(this, plurNode, 'plur.websocket.server.service');
	this._serverWebsocket = null;
	this._sessionMap = {};
	
	if (!plurNode.hasService(WebsocketService.namepath)) // lazy-load websocket service, which aggregates emit()
		plurNode.registerService(new WebsocketService(plurNode));
	
	var self = this;
	var websocketServiceEmitter = plurNode.getService(WebsocketService.namepath).emitter();
	websocketServiceEmitter.on('plur.websocket.send', function(event, data) {
		if (typeof self._sessionMap[data.sessionId] !==  'undefined')
			self.send(data.sessionId, data.event, data.data);
	});
	
	this.getNode().emitter().on('plur.session.close', function(event, data) {
		if (typeof self._sessionMap[data.sessionId] !==  'undefined')
			self.close(sessionId);
	});
};

WebsocketServerService._Connection = function(session, websocket, options) {
	this.id = session.getId();
	this.websocket = websocket;
	this.options = options;
};

WebsocketServerService.DEFAULT_PORT = 9090;

WebsocketServerService.prototype = PlurObject.create('plur/websocket/server/Service',
	WebsocketServerService,
	Service
);

WebsocketServerService.prototype.start = function() {
	Service.prototype.start.call(this);
	this._open();
};

WebsocketServerService.prototype._open = function(options) {
	var wss = new ws.Server({port: WebsocketServerService.DEFAULT_PORT});
	
	var self = this;
	this._serverWebsocket = wss;
	wss.on('connection', function(websocket) {
		console.log('Websocket client open');
		
		var websocketService = self.getNode().getService(WebsocketService.namepath);
		
		var session = new WebsocketSession('localhost', self);
		var sessionId = session.getId();
		var connection = new WebsocketServerService._Connection(session, websocket, options);
		self._sessionMap[connection.id] = connection;
		self.getNode().openSession(session);

		self.emitter().emit('plur.websocket.open', { sessionId: sessionId, io: 1 });
		websocketService.emitter().emit('plur.websocket.open', { sessionId: sessionId, io: 1 });

		websocket.on('close', function(data) {
			console.log('Websocket client closed' + ( data.wasClean ? '.' : ' abruptly.' )
					+ ' Reason: ' + data.reason + '. Code: ' + data.code + ': ' + sessionId);
			
			self.close();
			self.emitter().emit('plur.websocket.close', { sessionId: sessionId, io: 1 });
			websocketService.emitter().emit('plur.websocket.close', { sessionId: sessionId, io: 1 });
		});
		
		websocket.on('error', function(error) {
			if (typeof self._sessionMap[sessionId] ===  'undefined')
				return;

			console.log('Websocket client error (' + sessionId + '): ', error);
			self.emitter().emit('plur.websocket.error', { sessionId: sessionId, error: error, io: 1 });
			websocketService.emitter().emit('plur.websocket.error', { sessionId: sessionId, error: error, io: 1 });
			self.close(sessionId);
		});
		
		websocket.on('message', function(data) {
			if (typeof self._sessionMap[sessionId] ===  'undefined')
				return;
			
			data = ''+data;
			try {
				data = JSON.parse(data);
			} catch (e) { /* do nothing */ }
			
			console.log('Websocket client message received: ', data);
			
			self.emitter().emit('plur.websocket.message', { sessionId: sessionId, data: data, io: 1 });
			websocketService.emitter().emit('plur.websocket.message', { sessionId: sessionId, data: data, io: 1 });
			
			if (typeof data.e !== 'undefined') {
				self.emitter().emit(data.e, { sessionId: sessionId, event: data.e, data: data.d, io: 1 });
				websocketService.emitter().emit(data.e, { sessionId: sessionId, event: data.e, data: data.d, io: 1 });
			}
		

		});
		
		session.io.on('*', function(event, data, callback) {
			if (typeof data.sessionId !== 'undefined') // skip input
				return;
			if (typeof self._sessionMap[sessionId] ===  'undefined')
				return;
			
			self.send(sessionId, event, data);
		});
	});
};

WebsocketServerService.prototype.close = function(sessionId) {
	if (typeof this._sessionMap[sessionId] ===  'undefined')
		return;
	
	var connection = this._sessionMap[sessionId];
	delete this._sessionMap[sessionId];
	
	connection.websocket.close();
	this.getNode().closeSession(sessionId);
};

WebsocketServerService.prototype.stop = function() {
	Service.prototype.stop.call(this);
};

WebsocketServerService.prototype.send = function(sessionId, event, data, options) {
	if (typeof this._sessionMap[sessionId] ===  'undefined')
		throw new Error('Session not open: ' + sessionId);
	
	console.log('Sending websocket message to session #' + sessionId + ': ' + event);
	this._sessionMap[sessionId].websocket.send(JSON.stringify({
		e: event.toString(),
		d: data
	}));
};

return WebsocketServerService;
});