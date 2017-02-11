/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @module plur/error/Interface
 */
define([
    'plur/PlurObject',
    'plur/error/Error' ],
function(
    PlurObject,
    PlurError ) {

/**
 * Thrown on an attempt to instantiate an interface prototype.
 *
 * @class InterfaceError
 * @alias {module:plur/error/Interface}
 * @extends {module:plur/error/Error}
 */
class InterfaceError extends PlurError {
    /**
     * @param {string|undefined} message
     * @param {*} data
     */
    constructor(message, data) {
        if (typeof message === 'object') {
            data = message;
            message = 'Cannot instantiate an interface prototype.';
        } else if (typeof message === 'undefined') {
            message = 'Cannot instantiate an interface prototype.';
        }

        super(message, data);
    };
}

PlurObject.plurify('plur/error/Interface', InterfaceError);

return InterfaceError;
});