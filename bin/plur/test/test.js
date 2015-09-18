#!/usr/bin/env nodejs
/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires fs plur/PlurObject plur/test/Tester
 */
 'use strict';

var bootstrap = require('../../../js/plur/lib/bootstrap/nodejs.js');
bootstrap.require([
    'fs',
    'path',
    'glob',
    'plur/PlurObject',
    'plur/test/Tester' ],
function(
    fs,
    path,
    glob,
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
};

TestApp.prototype = PlurObject.create('plurbin/plur/test', TestApp);

TestApp.prototype._findTargets = function(callback) {
    var targets = [];
    var numPathsGlobbed = 0;
    var requireConfig = bootstrap.getRequireConfig();
    var applicationRoot = path.resolve(__dirname + '/../../../..'); //todo: use plur/file/System

    var pathNames = [];
    for (var key in requireConfig.paths) {
        if (key.match(/test/)) {
            pathNames.push(key);
        }
    }

    for (var i = 0; i < pathNames.length; ++i) {
        var key = pathNames[i];
        var jsPath = applicationRoot + '/' + requireConfig.paths[key];

        // scope jsPath value into callback
        glob(jsPath + '/**/*Test.js', (function(jsPath) {
            return function(err, files) {
                for (var i = 0; i < files.length; ++i) {
                    var filepath = files[i];
                    if (!path.basename(filepath).match(/^[a-zA-Z0-9_\-]+Test\.js$/)) {
                        continue;
                    }

                    var relativeFilepath = filepath.substring(jsPath.length - path.basename(jsPath).length);
                    var namepath = relativeFilepath.match(/^(.*)\.[^.]+$/)[1];
                    targets.push(namepath);
                }

                if (++numPathsGlobbed === pathNames.length) {
                    callback(targets);
                }
            };
        })(jsPath));
    }
};

TestApp.prototype.start = function() {
    // if no targets were provided, test everything under the sun
    if (this._targets.length === 0) {
        this._findTargets(function(targets) {
            var tester = new PlurTester();
            tester.test(targets);
        });
    } else {
        var tester = new PlurTester();
        tester.test(this._targets);
    }
};

new TestApp().start();

});
