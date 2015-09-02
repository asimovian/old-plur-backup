/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires lib/crypto-js plur/event/Emitter plur/node/NodeNetwork plur/session/Session plur/UUID
 */
define(['crypto-js', 'plur/event/Emitter', 'plur/node/NodeNetwork', 'plur/session/Session', 'plur/UUID'],
function(CryptoJS, Emitter, NodeNetwork, Session, UUID) {
	
/**
 * Application class for the Plur Server-Side Node.
 * Node is generic, can process any form of input.
 */
var PlurNode = function() {
	this._hashId = UUID.create();;
	this._emitter = new Emitter();
	this._serviceMap = {};
	this._sessionMap = {};
	var localnet = new NodeNetwork(this._hashId);
	this._networkHashMap = {
		local: localnet,
	};
	
	this._networkHashMap[localnet.getHashId()] = localnet;
};

PlurNode.prototype.getHashId = function() {
	return this._hashId;
};

/**
 * Starts the node. Initiates all sessions necessary.
 */
PlurNode.prototype.start = function() {
	for (var namepath in this._serviceMap) {
		var service = this._serviceMap[namepath];
		if (service.shouldAutostart())
			this._serviceMap[namepath].start();
	}

	this._emitter.emit('plur.node.start', { hashId: this._hashId });
};

/**
 * Registers a service with the node.
 */
PlurNode.prototype.registerService = function(service) {
	this._serviceMap[service.namepath] = service;
	this._emitter.emit('plur.node.service.register', { namepath: service.namepath });
};

/**
 * Retrieves a service registered to the node.
 * @throws Error if not found
 */
PlurNode.prototype.getService = function(namepath) {
	if (typeof this._serviceMap[namepath] === 'undefined')
		throw new Error('Service not registered: ' + namepath);
	
	return this._serviceMap[namepath];
};

PlurNode.prototype.hasService = function(namepath) {
	return ( typeof this._serviceMap[namepath] !== 'undefined' && this._serviceMap[namepath] !== null);
};

/**
 * Withdraws a service registered to the node.
 */
PlurNode.prototype.withdrawService = function(namepath) {
	var service = this._serviceMap[namepath];
	delete this._serviceMap[namepath];
	this._emitter.emit('plur.node.service.withdraw', { namepath: namepath, service: service });
};

/**
 * Stops the node, destroying all sessions.
 */
PlurNode.prototype.stop = function() {
	for (var id in this._sessionMap)
		this._sessionMap[id].close();
	
	this._sessionMap = [];
	
	for (var name in this._serviceMap)
		this._serviceMap[name].stop();
	
	this._emitter.emit('plur.node.stop');
	this._emitter.off();
};

PlurNode.prototype.emitter = function() {
	return this._emitter;
};

PlurNode.prototype.getLocalNetwork = function() {
	return this._networkHashMap.local;
};

PlurNode.prototype.getNetworkHashMap = function() {
	return this._networkHashMap;
};

PlurNode.prototype.addNetwork = function(network) {
	this._networkHashMap[network.getHashId()] = network;
};

PlurNode.prototype.removeNetwork = function(network) {
	delete _networkHashMap[network.getHashId()];
};

PlurNode.prototype.openSession = function(session) {
	this._sessionMap[session.getId()] = session;
	this._emitter.emit('plur.session.open', { sessionId: session.getId() });
};

PlurNode.prototype.acquireCapabilities = function(capabilities, minTrust, callback) {
	console.log('Acquiring capabilities with trust >=' + minTrust + ': ', capabilities);
	// search all nodes looking for known capabilities
	// iterate through each node session
	//todo: do this properly, use remote nodes
	for (var id in this._sessionMap) {
		var session = this._sessionMap[id];
		
		// request capabilities from this session
		session.io.emit('plur.capability.request', {
			capabilities: capabilities,
			minTrust: minTrust - 0.1 // remove .1 per hop. only this node is 1.00
		});
		
		// look for a valid response
		//TODO: filter and sort results.
		session.io.on('plur.capability.response', function(event, msg, listener) {
			if (typeof msg.sessionId === 'undefined')
				return;
			
			callback(session, msg.data.capabilities); //TODO: send remote node
			session.io.off(listener);
		});
	}
};

PlurNode.prototype.authenticateSession = function(id) {
	if (typeof this._sessionMap[id] === 'undefined')
		throw new Error('Session does not exist: ' + id);
	
	this._sessionMap[id].setState(Session.State.AUTHENTICATED);
	this._emitter.emit('plur.session.authenticated', { sessionId: id });
};

PlurNode.prototype.getSession = function(id) {
	return this._sessionMap[id];
};

PlurNode.prototype.closeSession = function(id) {
	delete this._sessionMap[id];
	this._emitter.emit('plur.session.close', { sessionId: id });
};

return PlurNode;
});