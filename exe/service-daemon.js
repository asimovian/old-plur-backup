#!/usr/bin/nodejs
/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 */
var requirejs = require('../../../../main/js/plur/plur-requirejs.js');
requirejs(['plur/service/daemon/Generic', 'plur/obj/Parser'], function(PlurGenericServiceDaemon, ObjParser) { // no-indent
	var parameters = null;
	if (typeof(process.argv[2]) !== 'undefined') {
		parameters = ObjParser.get().parseJson(process.argv[2]);
	}
	
	var environmentConfigs = null;
	if (typeof(process.argv[3]) !== 'undefined') {
		environmentConfigs = Parser.get().parseJson(process.argv[3]);
		Config.mergeEnvironment(environmentConfigs);
	}
	
	var daemon = new PlurGenericServiceDaemon(parameters);
	daemon.start();
}); // no-indent
