/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 */
'use strict';

(function() {
    var plurbootstrap = {};
    plurbootstrap.require = require('requirejs');

    plurbootstrap.require.config({
        baseUrl: '../',
        paths: {
            'plur': 'plur/js/plur',
            'plur-config': 'plur/cfg/json/plur',
            'plur-bin': 'plur/plur-bin/js/plur-bin',
            'plur-test': 'plur/plur-test/js/plur-test'
        },
        nodeRequire: require,
        enforceDefine: true
    });

    plurbootstrap.platformType = 'nodejs';

    module.exports = plurbootstrap;
})();
