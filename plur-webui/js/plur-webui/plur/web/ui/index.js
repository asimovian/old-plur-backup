/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur-www/blob/master/LICENSE.txt
 */
'use strict';

/**
 * Expects requirejs.js to have been pre-loaded by a <script> reference or dynamically.
 */
plurbootstrap.require([
    'plur/web/Bootstrap' ],
function(
    WebBootstrap ) {

WebBootstrap.init(plurbootstrap)
    .addPaths({'plur-webui': 'plur-webui/js/plur-webui'})
    .require(['plur-webui/plur/web/ui/index/App'], function(IndexApp) {
        try {
            new IndexApp().start();
        } catch (e) {
            console.log(e);
        }
    });
});
