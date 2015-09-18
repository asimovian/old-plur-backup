/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 */
'use strict';

/**
 * Expects requirejs.js to have been pre-loaded by a <script> reference or dynamically.
 */
(function() {
    var _bootstrap = {};
    _bootstrap.require = requirejs;

    _bootstrap.require.config({
        baseUrl: '../',
        paths: {
            'plur': 'plur/js/plur',
            'plur-test': 'plur/plur-test/js/plur-test'
        },
        nodeRequire: require,
        enforceDefine: true
    });

    _bootstrap.getRequireConfig = function() {
        return _bootstrap.require.s.contexts._.config;
    };
})();
