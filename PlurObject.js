/**
 * Utility for prototype object construction.
 *
 * @var plur/PlurObject
 * @copyright 2015 Asimovian LLC
 * @license https://github.com/asimovian/plur/blob/master/LICENSE.txt
 */
define([], function() {

var PlurObject = {};

/**
 * Creates a new prototype object.
 *
 * @param string classpath
 * @param Function constructor
 * @param Function parentConstructor
 * @param {string:string} properties
 * @var plur/PlurObject.create
 */
PlurObject.create = function(classpath, constructor, parentConstructor, properties) {
	constructor.CLASSPATH = classpath;
	
	var prototype = constructor.prototype;
	if (typeof parentConstructor !== 'undefined')
		prototype = Object.create(parentConstructor.prototype);

	prototype.constructor = constructor;
	prototype.CLASSPATH = classpath;
	return prototype;
};

return PlurObject;
});
