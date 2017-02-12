/**
 * @copyright 2017 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @module plur-webui/plur/web/IUI
 * @requires plur/PlurObject plur/service/AService
 */
define([
    '../../PlurObject',
    '../../../../../js/plur/service/AService' ],
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
class HtmlComponent  {
    init() {
        let body = this.addChild(new BodyComponent({ layout: '3panel' }));
        let menu = body.getChild('top').addChild(new HorizontalMenuComponent());
        menu.addMenuItem('Home', navtoHomeFunc);
        body.getChild('bottom').addChild(new WebUIComponent('plur-nodeui/html/footer.html'));
    };
}

return;
});