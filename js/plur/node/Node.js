/**
 * @copyright 2017 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @module plur/node/Node
 * @requires plur/PlurObject plur/node/INode plur/event/Emitter plur/comm/Channel
 */
'use strict';

define([
    'plur/PlurObject',
    'plur/node/INode',
    'plur/event/Emitter',
    'plur/comm/Channel',
    'plur/node/NodeNetwork',
    'plur/session/Session' ],
function(
    PlurObject,
    IPlurNode,
    Emitter,
    CommChannel,
    NodeNetwork,
    Session ) {
	
/**
 * Core functionality of the Plur system.
 * Started at the beginning of the Application.
 *
 * The PlurNode's Services are registered here before going online and withdrawn after going offline.
 * A node may be "attached" to the Application running it - running in the same thread - or "detached" - running in a
 * different thread.
 *
 * There may only be one attached node per Application and exactly one node per thread.
 */
class PlurNode {
    constructor() {
        this._status = IPlurNode.Status.OFFLINE;
        this._emitter = new Emitter();
        this._commChannel = new CommChannel();
        this._serviceMap = {};
        this._sessionMap = {};
    };

    status() {
        return this._status;
    };

    getPublicKeyHash() {
        return this._commChannel.getPublicKeyHash();
    };

    /**
     * Starts the node. Initiates all sessions necessary.
     */
    start() {
        for (let namepath in this._serviceMap) {
            let service = this._serviceMap[namepath];
            if (service.shouldAutostart())
                this._serviceMap[namepath].start();
        }

        this._emitter.emit('plur.node.start', {hashId: this._hashId});
    };

    comm() {
        return this._commChannel;
    };

    /**
     * Registers a service with the node.
     */
    registerService(service) {
        this._serviceMap[service.namepath] = service;
        this._emitter.emit('plur.node.service.register', {namepath: service.namepath});
    };

    /**
     * Retrieves a service registered to the node.
     * @throws Error if not found
     */
    getService(namepath) {
        if (typeof this._serviceMap[namepath] === 'undefined')
            throw new Error('Service not registered: ' + namepath);

        return this._serviceMap[namepath];
    };

    hasService(namepath) {
        return ( typeof this._serviceMap[namepath] !== 'undefined' && this._serviceMap[namepath] !== null);
    };

    /**
     * Withdraws a service registered to the node.
     */
    withdrawService(namepath) {
        let service = this._serviceMap[namepath];
        delete this._serviceMap[namepath];
        this._emitter.emit('plur.node.service.withdraw', {namepath: namepath, service: service});
    };

    /**
     * Stops the node, destroying all sessions.
     */
    stop() {
        for (let id in this._sessionMap)
            this._sessionMap[id].close();

        this._sessionMap = [];

        for (let name in this._serviceMap)
            this._serviceMap[name].stop();

        this._emitter.emit('plur.node.stop');
        this._emitter.off();
    };

    emitter() {
        return this._emitter;
    };

    getLocalNetwork() {
        return this._networkHashMap.local;
    };

    getNetworkHashMap() {
        return this._networkHashMap;
    };

    addNetwork(network) {
        this._networkHashMap[network.getHashId()] = network;
    };

    removeNetwork(network) {
        delete _networkHashMap[network.getHashId()];
    };

    openSession(session) {
        this._sessionMap[session.getId()] = session;
        this._emitter.emit('plur.session.open', {sessionId: session.getId()});
    };

    acquireCapabilities(capabilities, minTrust, callback) {
        console.log('Acquiring capabilities with trust >=' + minTrust + ': ', capabilities);
        // search all nodes looking for known capabilities
        // iterate through each node session
        //todo: do this properly, use remote nodes
        for (let id in this._sessionMap) {
            let session = this._sessionMap[id];

            // request capabilities from this session
            session.io.emit('plur.capability.request', {
                capabilities: capabilities,
                minTrust: minTrust - 0.1 // remove .1 per hop. only this node is 1.00
            });

            // look for a valid response
            //TODO: filter and sort results.
            session.io.on('plur.capability.response', function (event, msg, listener) {
                if (typeof msg.sessionId === 'undefined')
                    return;

                callback(session, msg.data.capabilities); //TODO: send remote node
                session.io.off(listener);
            });
        }
    };

    authenticateSession(id) {
        if (typeof this._sessionMap[id] === 'undefined')
            throw new Error('Session does not exist: ' + id);

        this._sessionMap[id].setState(Session.State.AUTHENTICATED);
        this._emitter.emit('plur.session.authenticated', {sessionId: id});
    };

    getSession(id) {
        return this._sessionMap[id];
    };

    closeSession(id) {
        delete this._sessionMap[id];
        this._emitter.emit('plur.session.close', {sessionId: id});
    };
}

PlurObject.plurify('plur/node/Node', PlurNode, [ INode ])
return PlurNode;
});