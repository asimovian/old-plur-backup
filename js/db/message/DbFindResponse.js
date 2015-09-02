/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 */

define(['plur/response/Response'], function(Response) { // no indent

var DbFindResponse = function(objects, columnNames) {
	this._objects = objects;
	this._columnNames = columnNames;
};

Find.CLASSPATH = 'plur/db/response/DbFindResponse';

DbFindResponse.fromObj = function(obj, instance) {
	var f = new Find(obj.objects, obj.columnNames);
	return f;
};

DbFindResponse.prototype = new Response();
DbFindResponse.prototype.constructor = DbFindResponse;
DbFindResponse.prototype.CLASSPATH = DbFindResponse.CLASSPATH;

DbFindResponse.prototype.getColumnNames = function() {
	return this._columnNames;
};

DbFindResponse.prototype.getObjects = function() {
	return this._objects;
};

DbFindResponse.prototype.toObj = function(obj) {
	var o = {
		classpath: this.CLASSPATH,
		objects: this._objects,
		columnNames: this._columnNames
	};
	
	return o;
};

}); // no indent