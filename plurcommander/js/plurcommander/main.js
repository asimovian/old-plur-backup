/**
 * @copyright 2017 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur-www/blob/master/LICENSE.txt
 */
'use strict';

/**
 * Expects web/bootstrap.js to be loaded.
 */
plurbootstrap.require([
    'plur/web/Bootstrap',
    'plur/web/ui/App' ],
function(
    WebBootstrap,
    WebUIApp ) {

// Add "plurcommander" to require()'s search path.
// Run the main application (IndexApp) once loaded.
WebBootstrap.init(plurbootstrap)
    .addPaths({
        'plurcommander': 'plurcommander/js/plurcommander',
        'plurcommander-cfg': 'plurcommander/cfg/plurcommander'
    })
    .require([
        'plurcommander/webui/service/Main',
        'plurcommander-cfg/webui/service/Main'],
        function(CommanderMainService, commanderMainServiceConfig) {
            try {
                let app = new WebUIApp(CommanderMainService, commanderMainServiceConfig, window);
                app.start();
            } catch (e) {
                console.log(e);
            }
        }
    )
});
