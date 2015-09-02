/**
 * <plur/test.js>
 * @copyright 2013 binaryCult
 * @license https://github.com/binarycult/plur/blob/master/LICENSE.txt
 * @author Roy Laurie <roy.laurie@gmail.com>
 */
var requirejs = require('../../../../main/js/plur/plur-requirejs.js');
requirejs(['plur/test/Tester'], function(PlurTester) {
	var targets = [];
	for (var i = 2; i < process.argv.length; ++i) {
		targets.push(process.argv[i]);
	}
	
	var tester = new PlurTester();
	tester.test(targets);
});
