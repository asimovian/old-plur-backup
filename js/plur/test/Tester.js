/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @require plur/PlurObject plur/error/Error
 */
define([
	'plur/PlurObject',
	'plur/error/Error',
	'plur/log/System' ],
function(
    PlurObject,
    PlurError,
    gSystemLogSingleton ) {

var Tester = function(testTargets) {
    this._log = gSystemLogSingleton.get();
    this._testTargets = testTargets;
    this._testTargetIndex = -1;
    this._resolve = null;
    this._reject = null;
};

Tester.prototype = PlurObject.create('plur/test/Tester', Tester);

Tester._TEST_CONSTRUCTOR = /^[a-zA-Z0-9_\-\/]+$/;

Tester.prototype._onComplete = function(namepath, method, passed) {
    if (passed) {
        gLog.info('Test passed: ' + namepath + '.' + method + '()');
    } else {
        gLog.error('Test failed: ' + namepath + '.' + method + '()');
    }
};
    
Tester.prototype.test = function() {
    var bootstrap = Bootstrap.get();
    var self = this;

    // pass a noop function that writes the resolve and reject methods to state for use by test callbacks
    var promise = new Promise(function(resolve, reject) {
        self._resolve = resolve;
        self._reject = reject;
    });

    this._testNextTarget(promise);

    return promise;
};

Tester.prototype._testNextTarget = function(promise) {
        this._testTarget = testTargets[++this._testTarget];

        if (!this._testTarget.match(Tester._TEST_CONSTRUCTOR)) {
            throw new PlurError('Invalid test target', { target: testTarget });
        }

        var promise = new PlurPromise(function(resolve, reject) {
            var methodPromise = null;

            bootstrap.require([this._testTarget], function(TestConstructor) {
                var test = new TestConstructor();

                for (methodName in test) {
                    if (!methodName.match(/^test/) || !test[methodName] instanceof Function || methodName === 'test') {
                        continue;
                    }

                    if (methodPromise === null) {
                        methodPromise = new PlurPromise(Tester.callbackTestMethod(test, methodName, resolve));
                    } else {
                        methodPromise.then(Tester._callbackTestMethod(test, methodName, resolve), reject);
                    }
                }
            });
        });

        promise.then(Tester._callbackTestNextTarget(reject, resolve));
    }

    return promise;
};

Tester._callbackTestMethod = function(test, methodName, targetResolve) {
    return function(methodResolve, methodReject) {
        this._log.info('Testing: ' + test.namepath + '.prototype.' + methodName + '()');

        var testMethod = test[methodName];
        testMethod();

        var promises = test.popPromises();
        if (promises.length === 0)  {
            if (targetResolve !== null) {
                targetResolve();
            } else {
                resolve();
            }
        } else {
            promises = promises.concat(new PlurPromise(Tester._timeoutPromiseExecutor));
            PlurPromise.all(promises, ( targetResolve !== null ? targetResolve : methodResolve ), reject});
        }
    }
};

Tester._timeoutPromiseExecutor = function(resolve, reject) {
    setTimeout(2000, {
        reject('Test timed out after 2000 ms');
    });
};

return Tester;
});