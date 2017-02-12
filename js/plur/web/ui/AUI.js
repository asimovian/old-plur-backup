/**
 * @copyright 2017 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @module plur-webui/plur/web/IUI
 * @requires plur/PlurObject plur/service/AService
 */
define([
    '../../PlurObject',
    'plur/service/AService' ],
function(
    PlurObject,
    IGraphicalUI ) {

/**
 * Handles core node-to-node communication, including handshakes.
 *
 * @class AWebUI
 * @abstract
 * @param plur/node/PlurNode
 */
class AWebUI  {
    static getDefaultConfig() {
        return AWebUI._DEFAULT_CONFIG;
    };

    static _DEFAULT_CONFIG = new ConstructorConfig(AWebUI, null, __FILE_CONFIG, {
        webui: {
            rootComponent: Config.string('plurcommander/plur/web/ui/main/Body')
        }
    });

    constructor(service, config, domWindow) {
        this._service = service;
        this._config = AWebUI.getDefaultConfig().merge(config);
        this._window = domWindow;
        this._document = domWindow.document;
        this._uiTree = new MapTreeNode();
    };

    config() {
        return this._config.config();
    };

    init() {
        '<script>g_plur.webui.include("/TemplateStuff", { attr: { }, prop: { } );</script>';
    };

    render() {
        this._uiTree.get().render(this._window);
    };
}

PlurObject.plurify('plurcommander/plur/web/IWebUI', IWebUI, [ IGraphicalUI ]);

return AWebUI;
});