/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject plur/test/Tester
 */
 'use strict';

define([
    'path',
    'glob',
    'plur/PlurObject',
    'plur/bootstrap/Bootstrap',
    'plur/test/Tester',
    'plur/file/System' ],
function(
    path,
    glob,
    PlurObject,
    Bootstrap,
    Tester,
    FileSystem ) {

/**
 * Performs tests against either a provided set of test classes / test methods or against all available tests.
 *
 * Searching involves globbing for JS files in each plur module (via RequireJS config 'paths').
 * Only modules with the word "test" in their name will be included.
 * Only JS files that end with "Test" will be targeted.
 *
 * @constructor plur-bin/plur/test/test
 **
 */
var TestApp = function() {
    this._targets = [];

    // load targets from the commandline, if available. searching will be performed by start() if necessary
    for (var i = 2; i < process.argv.length; ++i) {
        this._targets.push(process.argv[i]);
    }
};

TestApp.prototype = PlurObject.create('plur-bin/plur/test', TestApp);
PlurObject.implement(TestApp, IApplication);

TestApp.prototype._findTargets = function(callback) {
    var targets = [];
    var numPathsGlobbed = 0;
    var requireConfig = Bootstrap.get().getRequireConfig();
    var homePath = FileSystem.local().getHomePath();

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
        var jsPath = homePath + '/' + requireConfig.paths[key];

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
            var tester = new Tester(targets);
            self._start(tester);
        });
    } else {
        var tester = new Tester(this._targets);
        this._start(tester);
    }
};

TestApp.prototype._start = function(tester) {
    var self = this;
    var promise = tester.test(this._targets);
    promise.then(
        function() { self._onTesterPromiseFulfilled(); },
        function(error) { self._onTesterPromiseRejected(error); } );
};

/**
 * Expects variable "self" to exist in calling closure.
 */
TestApp.prototype._onTesterPromiseFulfilled = function() {
    console.log('Tests passed.');
    self.stop(true);
};

/**
 * Expects variable "self" to exist in calling closure.
 */
TestApp.prototype._onTesterPromiseRejected = function(error) {
    console.error('Tests failed');
    console.error(error.stack)
    self.stop(false);

};

TestApp.prototype.stop = function(success) {
    process.exit(success ? 0 : 1 );
};

TestApp.prototype.heartbeat = function() {
    return true;
};

return TestApp;
});
