/**
 * @copyright 2017 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @module plur/node
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
 *
 * @alias Node
 */
class PlurNode {
    /**
     * Creates the comm channel.
     * Creates and registers the plur node service.
     *
     * @param {module:plur/service/IService} plurNodeService
     */
    constructor(plurNodeServiceClass) {
        /** @type {module:plur/event/Emitter} **/
        this._emitter = new Emitter();
        /** @type {module:plur/comm/Channel} **/
        this._commChannel = new CommChannel();
        /** @type { {(string):(module:plur/service/IService)} } **/
        this._serviceMap = {};
        /** @type {module:plur/service/IService} **/
        this._service = new plurNodeServiceClass(this);

        // register the plur node service
        this._node.registerService(plurNodeServiceClass);
    };

    /**
     * Retrieves the plur node service.
     * @returns {module:plur/service/IService}
     */
    service() {
        return this._service;
    };

    /**
     * @returns {module:plur/service/IService.Status}
     */
    status() {
        return this._service.status();
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

    /**
     * @returns {string}
     */
    publicKeyHash() {
        return this._service.publicKeyHash();
    };

    /**
     * @returns {string}
     */
    publicKey() {
        return this._service.publicKey();
    };

    /**
     * Starts the node.
     * Starts any services already registered and configured to auto-start.
     * Emits a 'plur.node.started' event.
     */
    start() {
        // starts any services already registered that are configured to auto-start
        for (let namepath in this._serviceMap) {
            let service = this._serviceMap[namepath];
            if (service.config().autostart)
                this._serviceMap[namepath].start();
        }

        // announce
        this._emitter.emit('plur.node.started', { publicKeyHash: this.publicKeyHash() });
    };

    /**
     * Factories out a new service of type serviceClass and registers it with the node.
     * Emits a 'plur.node.service.registered' event.
     * @param {module:plur/service/IService} service
     */
    registerService(service) {
        this._serviceMap[service.namepath] = service;
        this._emitter.emit('plur.node.service.registered', { namepath: service.namepath });
    };

    /**
     * Retrieves a service registered to the node.
     * @param {string} namepath
     * @throws {module:plur/error/Error} if not found
     */
    getService(namepath) {
        if (typeof this._serviceMap[namepath] === 'undefined')
            throw new PlurError('Service not registered: ' + namepath);

        return this._serviceMap[namepath];
    };

    /**
     * @param {string} namepath
     * @returns {boolean}
     */
    hasService(namepath) {
        return ( typeof this._serviceMap[namepath] !== 'undefined' && this._serviceMap[namepath] !== null);
    };

    /**
     * Withdraws a service's registration to the node.
     * @param {string} namepath
     */
    withdrawService(namepath) {
        let service = this._serviceMap[namepath];
        delete this._serviceMap[namepath];
        this._emitter.emit('plur.node.service.withdraw', {namepath: namepath, service: service});
    };

    /**
     * Stops the node.
     * Stops all registered services.
     * Emits a 'plur.node.stopped' event.
     * Disables the emitter.
     */
    stop() {
        for (let name in this._serviceMap)
            this._serviceMap[name].stop();

        this._emitter.emit('plur.node.stop');
        this._emitter.off();
    };
}

PlurObject.plurify('plur/node/Node', PlurNode, [ INode ]);

return PlurNode;
});