/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject plur/service/Service plur/websocket/WebsocketService plur/session/Session
 */
define([
	'plur/PlurObject',
	'plur/log/System',
	'plur/service/AService',
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
 * @constructor plur/node/NodeWebsocketService
 * @extends plur/service/Service
 * @param plur/node/PlurNode
 */
var NodeWebsocketService = function(plurNode, config) {
	AService.call(this, plurNode, config);
};

NodeWebsocketService.prototype = PlurObject.create('plur/node/websocket/Service', NodeWebsocketService, AService);

/** Messages **/

NodeWebsocketService.ConnectionRequest = function(publicKey) {
    ARequest.call(this);

    this.publicKey = publicKey;
};

NodeWebsocketService.ConnectionRequest.prototype = PlurObject.create(
    NodeWebsocketService.namepath + '.ConnectionRequest',
    NodeWebsocketService.ConnectionRequest,
    ARequest );

NodeWebsocketService.ConnectionResponse = function(request, publicKey) {
    AResponse.call(this, request);

    this.publicKey = publicKey;
};

NodeWebsocketService.ConnectionRequest.prototype = PlurObject.create(
    NodeWebsocketService.namepath + '.ConnectionResponse',
    NodeWebsocketService.ConnectionResponse,
    AResponse );

/** **/

NodeWebsocketService.prototype._handshake = function() {
    var log = this.log();


	// the node introduces itself as soon as a websocket opens
	this._websocketService.emitter().on(WebsocketService.OPEN_EVENT, function(event, data) {
		log.info('Sending node hello to session: ' + data.sessionId);


		websocketService.send(data.sessionId, NodeWebsocketService.COMM_HELLO_EVENT, {
			nodeId: plurNode.getHashId(),
			sessionId: data.sessionId,
			networkId: plurNode.getLocalNetwork().getHashId()
		});
	});

	//todo: once the node receives, begin authentication

	// once the node receives authentication, finalize and announce
	websocketService.emitter().on(NodeWebsocketService.HELLO_EVENT, function(event, data) {
		log.info('Received hello from session #' + data.sessionId);

		log.info('Authenticating with session #' + data.sessionId);
		//todo: authentication messages :/
		plurNode.authenticateSession(data.sessionId);
		log.info('Authenticated with session #' + data.sessionId);
	});

	// relay all capabilities messages from authenticated sessions
	// allow responders to either emit immediately or in their own time. immediate responses will be aggregated
	websocketService.emitter().on(NodeWebsocketService.COMM_CAPABILITY_REQUEST_EVENT, function(event, msg) {
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

NodeWebsocketService.prototype.start = function() {
    AService.prototype.start.call(this);

	var plurNode = this.getPlurNode();
	var websocketService = plurNode.getService(WebsocketService.namepath);

	websocketService.onInitialData(function(connection, data) {
        if (typeof data.namepath === 'undefined' || data.namepath !== NodeWebsocketService.ConnectionRequest.namepath) {
            return;
        }

        MessageEvent.fromModel(data, function(messageEvent) {
            var connectionRequest = messageEvent.getMessage();

            self._addConnection(connection, connectionRequest.publicKey);

            plurNode.comm().connect(Hash.get().hash(connectionRequest.publicKey), function(messageEvent) {
                var data = messageEvent.model();
                websocketService.send(connection, data);
            }, true);

            var subscriptionId = websocketService.onData(connection, function(data) {
                var messageEvent = MessageEvent.fromModel(data);
                plurNode.comm().emit(messageEvent);
            });

            plurNode.comm().emit(new MessageEvent(new NodeWebsocketService.ConnectionResponse(
                connectionRequest,
                self.publicKey()
                connectionRequest.publicKey() )));
        });

	});
};

NodeWebsocketService.prototype.stop = function() {
	AService.prototype.stop.call(this);
};

return NodeWebsocketService;
});