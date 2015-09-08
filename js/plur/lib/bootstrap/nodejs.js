/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 */
'use strict';

(function() {
    var plur = {};

   /**
    * Pre-requisite for nodejs: npm install requirejs
    */
    plur.require = require('requirejs');

    plur.require.config({
        baseUrl: 'js',
        paths: {
            'plur' : 'plur'
        },
        nodeRequire: require,
        enforceDefine: true,
    });

    module.exports = plur;
})();
