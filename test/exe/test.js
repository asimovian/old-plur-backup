/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
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
