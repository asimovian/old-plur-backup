#!/usr/bin/env nodejs
/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires fs plur/PlurObject plur/test/Tester
 */
 'use strict';

var plur = require('../../../js/plur/lib/bootstrap/nodejs.js');
plur.require([
    'fs',
    'plur/PlurObject',
    'plur/test/Tester' ],
function(
    fs,
    PlurObject,
    PlurTester ) {

/**
 * Performs tests against either a provided set of test classes / test methods or against all available tests.
 *
 * @constructor plur/bin/test/test
 */
var TestApp = function() {
    this._targets = [];

    for (var i = 2; i < process.argv.length; ++i) {
        this._targets.push(process.argv[i]);
    }

    // if no targets were provided, test everything under the sun
    if (this._targets.length === 0) {
        // find test classes in the plur repository; plur/test
        var internalTestPath = __dirname + '/../../../test';
        fs.readdir(internalTestPath, function(err, files) {


        });

        // find test classes in sibling repositories; ../test
    }
};

TestApp.prototype = PlurObject.create('plurbin/plur/test', TestApp);

TestApp.prototype.run = function() {
    var tester = new PlurTester();
    tester.test(this._targets);
};

new TestApp().run();

});
