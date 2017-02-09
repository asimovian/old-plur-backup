/**
 * @copyright 2017 Asimovian LLC
 * @license MIT https://github.com/asimovian/asimovian-webui/blob/master/LICENSE.txt
 * @module plur-webui/plur/webui/index/App
 * @requires plur/PlurObject plur/app/IApplication plur/node/Node plur-webui/plur/web/ui/index/Service
 */
 'use strict';

define([
    'plur/PlurObject',
    'plur/app/IApplication',
    'plur/node/Node',
    'plur-webui/plur/web/ui/index/Service' ],
function(
    PlurObject,
    IApplication,
    PlurNode,
    WebUiService ) {

/**
 * Start and control a web-based plur node.
 *
 * @class IndexApp
 * @implements {module:plur/app/IApplication}
 * @alias {module:plur-webui/plur/web/index/App}
 */
class IndexApp {
    /**
     * Constructs a new Plur Node.
     *
     * @param domWindow
     * @param domDocument
     */
    constructor(domWindow, domDocument) {
        this._status = IApplication.Status.OFFLINE;
        this._domWindow = domWindow;
        this._domDocument = domDocument;
        this._node = new PlurNode();
        this._service = null;
    };

    /**
     * Starts the Plur Node.
     * Registers the WebUiService with the node and starts it.
     */
    start() {
        this._node.start();

        this._service = new WebUiService(this._node, null, this._domWindow, this._domDocument);
        this._node.registerService(this._service);
        this._service.start();

        this._status = IApplication.Status.ONLINE;
        console.log('plur-webui started.');
    };

    stop() {
        this._service.stop();
        this._node.stop();
    };

    status() {
        return this._status;
    };
}

PlurObject.plurify('plur-webui/plur/web/index/App', IndexApp, IApplication);


return IndexApp;
});