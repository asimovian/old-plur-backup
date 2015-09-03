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
PlurObject.prototype.namepath = PlurObject.namepath;

/**
 * Meant to be assigned to abstract prototype functions that require overriding in child classes.
 *
 * @function plur/PlurObject.pureVirtualFunction
 * @throws Error
 */
PlurObject.pureVirtualFunction = function() {
    throw new Error('Unimplmeneted pure virtual function');
};

/**
 * Creates a new prototype object.
 *
 * @function plur/PlurObject.create
 * @param string namepath
 * @param Function constructor
 * @param Function parentConstructor
 * @param {string:string} properties
 * @returns {}
 */
PlurObject.prototype.create = function(namepath, constructor, parentConstructor) {
    var prototype = constructor.prototype;

    if (typeof parentConstructor !== 'undefined') {
        prototype = Object.create(parentConstructor.prototype);
        prototype.constructor = constructor;
    }

    constructor.namepath = namepath;
    prototype.namepath = namepath;

    //todo: do not use global namespace for debugging flag
    if (typeof PLUR_DEBUG !== 'undefined' && PLUR_DEBUG === true) {
        // throw errors for any uimplemented pure virtual functions
        for (let propertyName in prototype) {
            if (prototype[propertyName] === PlurObject.pureVirtualFunction)
                throw new Error('Unimplemented virtual function: ' + namepath + '.prototype.' + propertyName);
        }
    }

    return prototype;
};

/**
 * @var PlurObject plur/PlurObject.singleton
 */
PlurObject.singleton = new PlurObject();

return PlurObject.singleton;
});
