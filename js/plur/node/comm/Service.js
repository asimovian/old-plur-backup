/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject plur/service/Service plur/websocket/WebsocketService plur/session/Session
 */
define([
	'plur/PlurObject',
	'plur/log/System',
	'plur/service/Service',
	'plur/websocket/WebsocketService',
	'plur/session/Session'],
function(
	PlurObject,
	SystemLog,
	Service,
	WebsocketService,
	Session) {

/**
 * Handles core node-to-node communication, including handshakes.
 *
 * @constructor plur/node/NodeCommService
 * @extends plur/service/Service
 * @param plur/node/PlurNode
 */
var NodeCommService = function(commServiceConfig, plurNode) {
	Service.call(this, commServiceConfig, plurNode, SystemLog.get());
};

NodeCommService.prototype = PlurObject.create('plur/node/NodeCommService', NodeCommService, Service);

NodeCommService.COMM_HELLO_EVENT = NodeCommService.namepath + '.comm.asl';
NodeCommService.COMM_CAPABILITY_REQUEST_EVENT = NodeCommService.namepath + '.comm.capabilityRequest';

NodeCommService.prototype._handshake = function() {
	// the node introduces itself as soon as a websocket opens
	this._websocketService.emitter().on(WebsocketService.OPEN_EVENT, function(event, data) {
		this._log.info('Sending node hello to session: ' + data.sessionId);

		websocketService.send(data.sessionId, NodeCommService.COMM_HELLO_EVENT, {
			nodeId: plurNode.getHashId(),
			sessionId: data.sessionId,
			networkId: plurNode.getLocalNetwork().getHashId()
		});
	});

	//todo: once the node receives, begin authentication

	// once the node receives authentication, finalize and announce
	websocketService.emitter().on(NodeCommService.HELLO_EVENT, function(event, data) {
		this._log.info('Received hello from session #' + data.sessionId);

		this._log.info('Authenticating with session #' + data.sessionId);
		//todo: authentication messages :/
		plurNode.authenticateSession(data.sessionId);
		this._log.info('Authenticated with session #' + data.sessionId);
	});

	// relay all capabilities messages from authenticated sessions
	// allow responders to either emit immediately or in their own time. immediate responses will be aggregated
	websocketService.emitter().on(NodeCommService.COMM_CAPABILITY_REQUEST_EVENT, function(event, msg) {
		var session = plurNode.getSession(msg.sessionId);
		if (session.getState() != Session.State.AUTHENTICATED)
			return;

		this._log.info('Received request for capabilities: ', msg.data.capabilities);
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

NodeCommService.prototype.start = function() {
	if (this.running())
		return;

	var plurNode = this.getPlurNode();
	var websocketService = plurNode.getService(WebsocketService.namepath);
    this._handshake(plurNode, websocketService);
	Service.prototype.start.call(this);
};

NodeCommService.prototype.stop = function() {
	Service.prototype.stop.call(this);
};
	
return NodeCommService;
});