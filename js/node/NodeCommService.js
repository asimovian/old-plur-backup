define([
	'plur/PlurObject',
	'plur/service/Service',
	'plur/websocket/WebsocketService',
	'plur/session/Session'],
function(
	PlurObject,
	Service,
	WebsocketService,
	Session) {

var NodeCommService = function(plurNode) {
	Service.call(this, plurNode);
	
	if (!plurNode.hasService(WebsocketService.namepath)) // lazy-load websocket service, which aggregates emit()
		plurNode.registerService(new WebsocketService(plurNode));
	
	var websocketService = plurNode.getService(WebsocketService.namepath);
	
	// the node introduces itself as soon as a websocket opens
	websocketService.emitter().on('plur.websocket.open', function(event, data) {
		console.log('Sending node hello to session: ' + data.sessionId);
		websocketService.send(data.sessionId, 'plur.node.comm.hello', {
			nodeId: plurNode.getHashId(),
			sessionId: data.sessionId,
			networkId: plurNode.getLocalNetwork().getHashId(),
		});
	});
	
	// once the node receives, begin authentication
	// once the node receives authentication, finalize and announce
	websocketService.emitter().on('plur.node.comm.hello', function(event, data) {
		console.log('Received hello from session #' + data.sessionId);
		
		console.log('Authenticating with session #' + data.sessionId);
		//todo: authentication messages :/
		plurNode.authenticateSession(data.sessionId);
		console.log('Authenticated with session #' + data.sessionId);
	});
	
	// relay all capabilities messages from authenticated sessions
	// allow responders to either emit immediately or in their own time. immediate responses will be aggregated
	websocketService.emitter().on('plur.capability.request', function(event, msg) {
		var session = plurNode.getSession(msg.sessionId);
		if (session.getState() != Session.State.AUTHENTICATED)
			return;
		
		console.log('Received capabilities request for capabilities: ', msg.data.capabilities);
		var d = {};
		for (var field in msg)
			d[field] = msg[field];

		d.responses = [];
		plurNode.emitter().emit(event, d);
		
		if (d.responses.length === 0)
			return;
		
		session.io.emit(d.responses[0].e, d.responses[0].d);
	});
};

NodeCommService.prototype = PlurObject.create('plur/node/NodeCommService', NodeCommService, Service);

NodeCommService.prototype.start = function() {
	if (this.running())
		return;
	
	var websocketService = this.getNode().getService(WebsocketService.namepath);
	websocketService.start();
	
	Service.prototype.start.call(this);
};

NodeCommService.prototype.stop = function() {
	Service.prototype.stop.call(this);
};
	
return NodeCommService;
});