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

NodeWebsocketService.ConnectionRequest = function(apiVersion, publicKey, modelTransformers) {
    ARequest.call(this);

    this.apiVerison = apiVerison;
    this.publicKey = publicKey;
    this.modelTransformers = modelTransformers;

};

NodeWebsocketService.ConnectionRequest.prototype = PlurObject.create(
    NodeWebsocketService.namepath + '.ConnectionRequest',
    NodeWebsocketService.ConnectionRequest,
    ARequest );

NodeWebsocketService.ConnectionResponse = function(request, apiVersion, publicKey, commServicePublicKey, modelTransformers) {
    AResponse.call(this, request);

    this.apiVerison = apiVerison;
    this.publicKey = publicKey;
    this.commServicePublicKey = commServicePublicKey;
    this.modelTransformers = modelTransformers;
};

NodeWebsocketService.ConnectionRequest.prototype = PlurObject.create(
    NodeWebsocketService.namepath + '.ConnectionResponse',
    NodeWebsocketService.ConnectionResponse,
    AResponse );

/** **/

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
                var data = messageEvent.createEnvelope().toData();
                websocketService.send(connection, data);
            }, true);

            var subscriptionId = websocketService.onData(connection, function(encryptedData) {
                var envelope = MessageEvent.Envelope.fromData(data);
                plurNode.comm().emit(envelope.getMessageEvent(messageEvent));
            });

            // respond to request
            plurNode.comm().emit(new MessageEvent(new NodeWebsocketService.ConnectionResponse(
                connectionRequest,
                self.publicKey(),
                plurNode.getService(IndexService).publicKey(),
                connectionRequest.publicKey() )));
        });
	});

	plurNode.comm.
};

NodeWebsocketService.prototype.stop = function() {
	AService.prototype.stop.call(this);
};

return NodeWebsocketService;
});