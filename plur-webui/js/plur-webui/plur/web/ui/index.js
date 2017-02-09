/**
 * @copyright 2017 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur-www/blob/master/LICENSE.txt
 */
'use strict';

/**
 * Expects web/bootstrap.js to be loaded.
 */
plurbootstrap.require([
    'plur/web/Bootstrap' ],
function(
    WebBootstrap ) {

// Add "plur-webui" to require()'s search path.
// Run the main application (IndexApp) once loaded.
WebBootstrap.init(plurbootstrap)
    .addPaths({
        'plur-webui': 'plur-webui/js/plur-webui'
    })
    .require([
        'plur-webui/plur/web/ui/index/App' ],
        function(IndexApp) {
            try {
                new IndexApp().start();
            } catch (e) {
                console.log(e);
            }
        }
    );
});
