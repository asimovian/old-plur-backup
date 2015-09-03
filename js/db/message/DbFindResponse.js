/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject plur/response/Response
 */
define(['plur/PlurObject', 'plur/response/Response'], function(PlurObject, Response) { // no indent

/**
 * @var plur/db/message/DbFindResponse
 **
 * @function plur/db/message/DbFindResponse
 * @param [] objects
 * @param string[] columnNames
 */
var DbFindResponse = function(objects, columnNames) {
	this._objects = objects;
	this._columnNames = columnNames;
};

DbFindResponse.fromObj = function(obj, instance) {
	var f = new Find(obj.objects, obj.columnNames);
	return f;
};

DbFindResponse.prototype = PlurObject.create('plur/db/message/DbFindResponse', DbFindResponse, Response);

DbFindResponse.prototype.getColumnNames = function() {
	return this._columnNames;
};

DbFindResponse.prototype.getObjects = function() {
	return this._objects;
};

DbFindResponse.prototype.toObj = function(obj) {
	var o = {
		namepath: this.namepath,
		objects: this._objects,
		columnNames: this._columnNames
	};
	
	return o;
};

});