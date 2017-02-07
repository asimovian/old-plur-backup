/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 */
'use strict';

/**
 * Expects requirejs.js to have been pre-loaded by a <script> reference or dynamically.
 */
var plurbootstrap = (function() {
    var platformBoostrap = {};
    platformBoostrap.require = requirejs;

    platformBoostrap.require.config({
        baseUrl: '.',
        paths: {
            'plur': 'plur/js/plur',
            'plur-test': 'plur/plur-tests/js/plur-tests'
        },
        nodeRequire: require,
        enforceDefine: true
    });

    platformBoostrap.platformType = 'web';
    return platformBoostrap;
})();
