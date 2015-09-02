/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 */
define(['plur/PlurObject, plur/exception/Exception'], function(PlurObject, PlurException) { // no indent
	
var ObjParser = function() {
	if (typeof(ObjParser._instance) !== 'undefined') { // enforce singleton pattern
		throw new PlurException('ObjParser singleton already initialized.');
	}
	
	this._parsers = {};
};

ObjParser.get = function() {
	if (typeof ObjParser._instance === 'undefined') {
		ObjParser._instance = new ObjParser();
	}
	
	return ObjParser._instance;
}

ObjParser._instantiate = function(classpath, obj, callback) {
	require([classpath], function(Constructor) {
		var instance = Constructor.fromObj(obj);
		callback(instance);
	});
};

PlurObject.createClass('plur/service/daemon/ObjParser', 
	parse: function(obj, callback) {
		var results = [];
		var objs = JSON.parse(json);
		if (typeof(objs.length) === 'undefined') {
			objs = [objs];
		}

		for (var i = 0, objs; i < objs.length; ++i) {
			var obj = objs[i];
			var classpath = objs[i].CLASSPATH;
			ObjParser._instantiate(classpath, obj, function(instance) {
				results.push(instance);
				if (results.length === objs.length) {
					callback(results);
				}
			});
		}
	},
	
	
}

return ObjParser;
}); // no indent