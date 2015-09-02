/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 */
define(function() { // no indent

var Tester = function() {

};

Tester.CLASSPATH = 'plur/test/Tester';

Tester.prototype = {
    CLASSPATH: Tester.CLASSPATH,
    _TARGET_CLASS: /^[a-zA-Z0-9_\-\/]+$/,
    _TARGET_METHOD: /^[a-zA-Z0-9_\-\/]+\.[a-zA-Z0-9_\-]+$/,
    
    test: function(targets) {
    	var self = this;
    	
    	function onComplete(classpath, method, result) {
    		if (result === 'pass') {
				console.log('Test passed: ' + target + '.' + method + '()');
    		} else {
    			console.log('Test failed: ' + target + '.' + method + '()');
    		}
    	}
    	
    	for (var t = 0; t < targets.length; ++t) {
    		var target = targets[t];
    		if (target.match(this._TARGET_METHOD)) {
    			var parts = target.split('.');
    			var classpath = parts[0];
    			var method = parts[1];
    			console.log('Testing: ' + classpath + '.' + method);
    			requirejs([classpath], function(TargetClass) {
    				var obj = new TargetClass(onComplete);
    				obj[method]();
    			});
    		} else if (target.match(this._TARGET_CLASS)){
    			requirejs([target], function(TargetClass) {
    				var obj = new TargetClass(onComplete);
    				for (key in obj) {
    					if (key.match(/^test/) && obj[key] instanceof Function) {
    						console.log('Testing: ' + target + '.' + key + '()');
    						obj[key]();
    					}
    				}
    			});
    		} else {
    			throw new PlurException('Invalid test target: ' + target);
    		}
    	}
    }
};

return Tester;
}); // no indent