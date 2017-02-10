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
 * @class IndexService
 * @extends plur/service/AService
 * @param plur/node/PlurNode
 */
class IndexService extends AService {
    constructor(plurNode, config) {
        super(this, plurNode, IndexService.DEFAULT_CONFIG.merge(config));
    };

    start() {
        super._preStart();
        super._postStart();
    };

    stop() {
        super._preStop();
        super._postStop();
    };
}


PlurObject.plurify('plur-webui/plur/web/ui/index/Service', IndexService);

return IndexService;
});