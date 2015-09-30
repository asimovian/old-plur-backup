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

var gLog = gSystemLogSingleton.get();

var Tester = function() {
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
    
Tester.prototype.test = function(testTargets) {
    var bootstrap = Bootstrap.get();
    var promise = new PlurPromise();
    var self = this;

    for (var t = 0; t < testTargets.length; ++t) {
        var testTarget = testTargets[t];

        if (!testTarget.match(Tester._TEST_CONSTRUCTOR)) {
            throw new PlurError('Invalid test target', { target: testTarget });
        }

        bootstrap.require([testTarget], function(TestConstructor) {
            var test = new TestConstructor();

            for (propertyName in test) {
                if (!propertyName.match(/^test/) || !test[propertyName] instanceof Function || propertyName === 'test') {
                    continue;
                }

                var testMethod = test[propertyName];

                gLog.info('Testing: ' + testTarget + '.' + propertyName + '()');

                testMethod();

                if (test.hasPromises()) {
                    test.onPromises(2000, // times out after 2 seconds
                        function() { self._onComplete(testTarget, propertyName, true); }, // resolved
                        function() { self._onComplete(testTarget, propertyName, false); } // rejected
                    );
                } else {
                    self._onComplete(testTarget, propertyName, true);

                }
            }
        });
    }
};

return Tester;
});