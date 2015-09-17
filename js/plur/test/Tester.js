/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @require plur/PlurObject plur/error/Error
 */
define([
	'plur/PlurObject',
	'plur/error/Error' ],
function(
    PlurObject,
    PlurError ) {

var Tester = function() {
};

Tester.prototype = PlurObject.create('plur/test/Tester', Tester);

Tester._TEST_CLASS = /^[a-zA-Z0-9_\-\/]+$/;
Tester._TEST_METHOD = /^[a-zA-Z0-9_\-\/]+\.[a-zA-Z0-9_\-]+$/;

Tester.prototype._onComplete = function(namepath, method, passed) {
    if (passed) {
        console.log('Test passed: ' + namepath + '.' + method + '()');
    } else {
        console.log('Test failed: ' + namepath + '.' + method + '()');
    }
};
    
Tester.prototype.test = function(testTargets) {
    var self = this;

    for (var t = 0; t < testTargets.length; ++t) {
        var testTarget = testTargets[t];
        // determine whether the test target is an entire test class or a specific test method
        if (testTarget.match(Tester._TEST_METHOD)) {
            // test a specific method
            var parts = testTarget.split('.');
            var namepath = parts[0];
            var method = parts[1];

            console.log('Testing: ' + namepath + '.' + method);

            requirejs([namepath], function(TestClass) {
                var obj = new TestClass();
                obj[method]();
                self._onComplete(namepath, method, true);
            });
        } else if (testTarget.match(Tester._TEST_CLASS)){
            // test an entire class
            requirejs([testTarget], function(TestClass) {
                var obj = new TestClass(Tester._onComplete);
                for (propertyName in obj) {
                    if (propertyName.match(/^test/) && obj[propertyName] instanceof Function && propertyName !== 'test') {
                        console.log('Testing: ' + testTarget + '.' + propertyName + '()');
                        obj[propertyName]();
                        self._onComplete(testTarget, propertyName, true);
                    }
                }
            });
        } else {
            throw new PlurError('Invalid test testTarget: ' + testTarget);
        }
    }
};

return Tester;
});