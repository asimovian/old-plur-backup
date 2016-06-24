/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @require plur/PlurObject plur/error/Error
 */
 'use strict';

define([
	'plur/PlurObject',
	'plur/error/Error',
	'plur/log/System',
	'plur/bootstrap/Bootstrap',
	'plur/es6/Promise' ],
function(
    PlurObject,
    PlurError,
    SystemLog,
    Bootstrap,
    PlurPromise ) {

var Tester = function(testTargets) {
    this._log = SystemLog.get();
    this._testTargets = testTargets;
    this._testTargetIndex = -1;
    this._testTarget = null;
    this._promise = null;
    this._promiseResolve = null;
    this._promiseReject = null;
};

Tester.prototype = PlurObject.create('plur/test/Tester', Tester);

Tester._TEST_CONSTRUCTOR = /^[a-zA-Z0-9_\-\/]+$/;

Tester.prototype.test = function() {
    var bootstrap = Bootstrap.get();
    var self = this;

    // pass a noop function that writes the resolve and reject methods to state for use by test callbacks
    this._promise = new PlurPromise(function(resolve, reject) {
        self._promiseResolved = resolve;
        self._promiseReject = reject;
    });

    this._testNextTarget();

    return this._promise;
};

Tester.prototype._rejected = function(error) {
    this._log.error('Test failed: ' + this._testTarget + ': ' + error);
    this._promiseReject(error);
};

Tester.prototype._resolved = function() {
    this._log.info('Tests passed: ' + this._testTarget);
    this._promiseResolve();
};

Tester.prototype._testNextTarget = function() {
    var self = this;

    // if this was the last target prototype, resolve to pass the test entirely
    if (this._testTargetIndex === this._testTargets.length) {
        this._resolved();
        return;
    }

    this._testTarget = this._testTargets[++this._testTargetIndex];

    if (!this._testTarget.match(Tester._TEST_CONSTRUCTOR)) {
        throw new PlurError('Invalid test target', { target: testTarget });
    }

    this._log.info('Testing object: ' + this._testTarget + ' ...');

    var targetPromise = new PlurPromise(function(targetPromiseResolve, targetPromiseReject) {
        Bootstrap.get().require([self._testTarget], function(TestConstructor) {
            var test = new TestConstructor();

            var methodPromiseResolve = null;
            var methodPromise = new PlurPromise(function(resolve, reject) {
                methodPromiseResolve = resolve;
            });

            var testMethodNames = [];

            for (var methodName in test) {
                if (!methodName.match(/^test/) || !test[methodName] instanceof Function || methodName === 'test') {
                    continue;
                }

                testMethodNames.push(methodName);
            }

            self._testNextMethod(methodPromise, test, 0, testMethodNames, targetPromiseResolve, targetPromiseReject);

            methodPromiseResolve();

        });
    });

    targetPromise.then(function() { self._testNextTarget() }, function(errors) { self._rejected(errors); });
};

Tester.prototype._testNextMethod = function(prevMethodPromise, test, testMethodIndex, testMethodNames, targetPromiseResolve, targetPromiseReject) {
    var self = this;

    prevMethodPromise.then(
        function() {
            var methodPromise = self._testMethod(test, testMethodNames[testMethodIndex]);
            methodPromise.then(
                function() {
                    self._log.info('Test passed: ' + test.namepath + '.prototype.' + testMethodNames[testMethodIndex] + '()');

                    if (++testMethodIndex < testMethodNames.length) {
                            self._testNextMethod(methodPromise, test, testMethodIndex, testMethodNames, targetPromiseResolve, targetPromiseReject);
                    } else {
                        targetPromiseResolve();
                    }
                },
                targetPromiseReject
            );
        },
        targetPromiseReject
    );
};

Tester.prototype._testMethod = function(test, methodName) {
    var self = this;

    var methodTestPromise = new PlurPromise(function(resolve, reject) {
        self._log.info('Testing method: ' + test.namepath + '.prototype.' + methodName + '()');
        test[methodName]();
        resolve();

        /*var promises = test.popPromises();
        if (promises.length === 0)  {
            if (targetPromiseResolve !== null) {
                targetPromiseResolve();
            } else {
                resolve();
            }
        } else {
            promises = promises.concat(new PlurPromise(Tester._timeoutPromiseExecutor));
            PlurPromise.all(promises, ( targetResolve !== null ? targetResolve : methodResolve ), reject);
        }*/
    });

    return methodTestPromise;
};

Tester._timeoutPromiseExecutor = function(resolve, reject) {
    setTimeout(2000, function(resolve, reject) {
        reject('Test timed out after 2000 ms');
    });
};

return Tester;
});