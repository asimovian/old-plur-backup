/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 */
'use strict';

(function() {
    var plur = {};
    plur.require = require('requirejs');

    plur.require.config({
        baseUrl: '../',
        paths: {
            'plur' : 'plur/js/plur',
            'plurtest' : 'plur/plurtest/js/plurtest'
        },
        nodeRequire: require,
        enforceDefine: true,
    });

    module.exports = plur;
})();
