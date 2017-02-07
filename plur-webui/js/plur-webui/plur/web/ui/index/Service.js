/**
 * @copyright 2015 Asimovian LLC
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

/**
 * Handles core node-to-node communication, including handshakes.
 *
 * @class IndexService
 * @extends plur/service/AService
 * @param plur/node/PlurNode
 */
class IndexService {
    constructor(plurNode, config) {
        AService.call(this, plurNode, IndexService.DEFAULT_CONFIG.merge(config));
    };

    start() {
        AService.prototype.start.call(this);
    };

    stop() {
        AService.prototype.stop.call(this);
    };
}


PlurObject.plurify('plur/node/IndexService', IndexService, AService);

return IndexService;
});