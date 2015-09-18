/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 */
'use strict';

(function() {
    var platformBootstrap = {};
    platformBootstrap.require = require('requirejs');

    platformBootstrap.require.config({
        baseUrl: '../',
        paths: {
            'plur': 'plur/js/plur',
            'plur-test': 'plur/plur-test/js/plur-test',
            'plur-bin': 'plur/plur-bin/js/plur-bin'
        },
        nodeRequire: require,
        enforceDefine: true
    });

    platformBootstrap.platformType = 'nodejs';

    module.exports = platformBootstrap;
})();
