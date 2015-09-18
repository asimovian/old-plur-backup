#!/usr/bin/env nodejs
/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires fs plur/PlurObject plur/test/Tester
 */
 'use strict';

var bootstrap = require('../../../js/plur/nodejs/Bootstrap.js');
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
 * Searching involves globbing for JS files in each plur module (via RequireJS config 'paths').
 * Only modules with the word "test" in their name will be included.
 * Only JS files that end with "Test" will be targeted.
 *
 * @constructor plurbin/plur/test/test
 **
 */
var TestApp = function() {
    this._targets = [];

    // load targets from the commandline, if available. searching will be performed by start() if necessary
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

    // create an array of potential test targets, skipping any paths that do not include the word "test" in their name
    var pathNames = [];
    for (var key in requireConfig.paths) {
        if (key.match(/test/)) {
            pathNames.push(key);
        }
    }

    // pathNames.length will be used by the glob handler to identify when all operations have been completed
    for (var i = 0; i < pathNames.length; ++i) {
        var key = pathNames[i];
        var jsPath = applicationRoot + '/' + requireConfig.paths[key];

        // scope jsPath value into callback as it will change value on the next iteration
        glob(jsPath + '/**/*Test.js', (function(jsPath) {
            return function(err, files) {
                for (var i = 0; i < files.length; ++i) {
                    var filepath = files[i];
                    // skip any files that do not end in "Test.js"
                    if (!path.basename(filepath).match(/^[a-zA-Z0-9_\-]+Test\.js$/)) {
                        continue;
                    }

                    // remove the module path root from the filepath, making it relative (like the namepath is)
                    var relativeFilepath = filepath.substring(jsPath.length - path.basename(jsPath).length);
                    // remove the extension from the name to form a valid namepath
                    var namepath = relativeFilepath.match(/^(.*)\.[^.]+$/)[1];
                    targets.push(namepath);
                }

                // check if we've finished globbing every path yet, callback if we have
                if (++numPathsGlobbed === pathNames.length) {
                    callback(targets);
                }
            };
        })(jsPath));
    }
};

TestApp.prototype.start = function() {
    // if no targets were provided, find and test everything under the sun
    if (this._targets.length === 0) {
        var self = this;
        this._findTargets(function(targets) {
            self._targets = targets;
            var tester = new PlurTester();
            tester.test(self._targets);
        });
    } else {
        var tester = new PlurTester();
        tester.test(this._targets);
    }
};

new TestApp().start();

});
