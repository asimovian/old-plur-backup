/**
 * @copyright 2016 Asimovian LLC
 * @license MIT https://github.com/asimovian/asimovian-webui/blob/master/LICENSE.txt
 * @module plur-webui/plur/webui/index/App
 * @requires plur/PlurObject plur/app/IApplication
 */
 'use strict';

define([
    'plur/PlurObject',
    'plur/app/IApplication',
    'plur-webui/plur/web/ui/index/Service',
    ],
function(
    PlurObject,
    IApplication,
    WebUiService ) {

/**
 * Application for web.asimovian.software website.
 *
 * @class IndexApp
 * @implements {module:plur/app/IApplication}
 * @alias {module:plur-webui/plur/web/index/App}
 */
class IndexApp {
    constructor(domWindow, domDocument) {
        this._domWindow = domWindow;
        this._domDocument = domDocument;
        this._node = new PlurNode();
        this._service = null;
    };

    /**
     * 
     */
    start() {
        this._node.start();

        this._service = new WebUiService(this._node, null, this._domWindow, this._domDocument);
        this._node.registerService(this._service);
        this._service.start();

        console.log('plur-webui started.');
    };
}

PlurObject.plurify('plur-webui/plur/web/index/App', IndexApp, IApplication);


return IndexApp;
});