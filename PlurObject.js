/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 */
define([], function() {

/**
 * Utility for prototype object construction.
 *
 * @var plur/PlurObject
 **
 * @function PlurObject
 */
var PlurObject = function() {};

// Standardize PlurObject
PlurObject.namepath = 'plur/PlurObject';
PlurObject.prototype.namepath = namepath;

/**
 * Creates a new prototype object.
 *
 * @function plur/PlurObject.create
 * @param string namepath
 * @param Function constructor
 * @param Function parentConstructor
 * @param {string:string} properties
 * @return {}
 */
PlurObject.prototype.create = function(namepath, constructor, parentConstructor) {
    var prototype = constructor.prototype;

    if (typeof parentConstructor !== 'undefined') {
        prototype = Object.create(parentConstructor.prototype);
        prototype.constructor = constructor;
    }

    constructor.namepath = namepath;
    prototype.namepath = namepath;

    return prototype;
};

/**
 * @var PlurObject plur/PlurObject.singleton
 */
PlurObject.singleton = new PlurObject();

return PlurObject.singleton;
});
