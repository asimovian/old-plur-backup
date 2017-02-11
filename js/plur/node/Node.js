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
    CommChannel ) {
	
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
        /** @type {module:plur/node/INode.Status} **/
        this._status = IPlurNode.Status.OFFLINE;
        /** @type {module:plur/event/Emitter} **/
        this._emitter = new Emitter();
        /** @type {module:plur/comm/Channel} **/
        this._commChannel = new CommChannel();
        this._serviceMap = {};
    };

    status() {
        return this._status;
    };

    /**
     * @returns {module:plur/event/Emitter}
     */
    emitter() {
        return this._emitter;
    };

    /**
     * @returns {module:plur/comm/Channel}
     */
    comm() {
        return this._commChannel;
    };

    publicKeyHash() {
        return this._commChannel.getPublicKeyHash();
    };

    publicKey() {
        return this._commChannel.getPublicKey();
    };

    /**
     * Starts the node. Initiates all sessions necessary.
     */
    start() {
        // starts any services already registered that are configured to auto-start
        for (let namepath in this._serviceMap) {
            let service = this._serviceMap[namepath];
            if (service.shouldAutostart())
                this._serviceMap[namepath].start();
        }

        // announce
        this._emitter.emit('plur.node.start', { publicKeyHash: this.publicKeyHash() });
    };

    /**
     * Registers a service with the node.
     * @param {module:plur/service/IService} service
     */
    registerService(service) {
        this._serviceMap[service.namepath] = service;
        this._emitter.emit('plur.node.service.register', { namepath: service.namepath });
    };

    /**
     * Retrieves a service registered to the node.
     * @param {string} namepath
     * @throws {Error} if not found
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
}

PlurObject.plurify('plur/node/Node', PlurNode, [ INode ]);

return PlurNode;
});