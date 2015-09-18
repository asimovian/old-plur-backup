#!/usr/bin/env nodejs
/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires fs plur/PlurObject plur/test/Tester
 */
 'use strict';

var platformBootstrap = require('../../../js/plur/nodejs/bootstrap.js');
platformBootstrap.require([
    'plur/nodejs/Bootstrap',
    'plur-bin/plur/test/TestApp' ],
function(
    NodeJsBootstrap,
    TestApp ) {

NodeJsBootstrap.init(platformBootstrap);
new TestApp().start();

});
