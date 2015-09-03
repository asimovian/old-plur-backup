/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 */
define(['plur/PlurObject, plur/exception/Exception'], function(PlurObject, PlurException) {

/**
 * @var plur/obj/ObjParser
 */
var ObjParser = function() {
};

ObjParser.prototype = PlurObject.create('plur/obj/ObjParser', ObjParser);

ObjParser.prototype.parse = function(obj, callback) {
    var results = [];
    var objs = JSON.parse(json);

    if (typeof objs.length === 'undefined') {
        objs = [objs];
    }

    for (let i = 0, objs; i < objs.length; ++i) {
        let obj = objs[i];
        let namepath = objs[i].namepath;
        this._instantiate(namepath, obj, function(instance) {
            results.push(instance);
            if (results.length === objs.length) {
                callback(results);
            }
        });
    }
};

ObjParser.prototype._instantiate = function(namepath, obj, callback) {
	require([namepath], function(Constructor) {
		var instance = Constructor.fromObj(obj);
		callback(instance);
	});
};

ObjParser.singleton = new ObjParser();

return ObjParser.singleton;
});