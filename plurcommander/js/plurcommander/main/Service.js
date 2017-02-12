/**
 * @copyright 2017 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @module plur-www/plur/www/index/Service
 * @requires plur/PlurObject plur/service/AService
 */
define([
    'plur/PlurObject',
    'plur/service/AService' ],
function(
    PlurObject,
    AService ) {

//TODO: Refactor this into IWebUIService and AWebUIService

/**
 * Handles core node-to-node communication, including handshakes.
 *
 * @class CommanderMainService
 * @extends plur/service/AService
 * @param plur/node/PlurNode
 */
class CommanderMainService extends AService {
    static _CONFIG_TEMPLATE = new ConfigTemplate(CommanderMainService, AService, {
        service: {
            autostart: true,
            webui: {
                commander: {
                    foo: '<br>'
                }
            }
        }
    });

    static configTemplate() {
        return CommanderMainService._CONFIG_TEMPLATE;
    };

    /**
     *
     * @param {plur/node/Node} plurNode
     * @param config
     */
    constructor(plurNode, config) {
        super(this, plurNode, CommanderMainService.configTemplate().createConfig(config));

        this._webui = plurNode.getService(WebUIService);
    };

    start() {
        super._preStart();

        this._webui.load(this.config().root);

        super._postStart();
    };

    stop() {
        super._preStop();
        super._postStop();
    };
}


PlurObject.plurify('plurcommander/main/Service', CommanderMainService);

return CommanderMainService;
});