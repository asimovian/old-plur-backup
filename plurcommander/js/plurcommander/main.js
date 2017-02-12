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
    WebBootstrap ) {

// Add "plurcommander" to require()'s search path.
// Run the main application (IndexApp) once loaded.
WebBootstrap.init(plurbootstrap)
    .addPaths({
        'plurcommander': 'plurcommander/js/plurcommander',
        'plurcommander-cfg': 'plurcommander/cfg/plurcommander'
    })
    .require([
        'plurcommander/service/Main',
        'plurcommander-cfg/service/Main'],
        function(CommanderMainService, commanderMainServiceConfig) {
            try {
                new WebUIApp(CommanderMainService, commanderMainServiceConfig, window).start();
            } catch (e) {
                console.log(e);
            }
        }
    )
});
