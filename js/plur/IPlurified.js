/**
 * @copyright 2016 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @module plur/IPlurified
 */

define(function() {

/**
 * Standard interface for all Plur library classes.
 *
 * @class IPlurified
 * @interface IPlurified
 * @alias {module:plur/IPlurified}
 */
class IPlurified {
    constructor() {
        throw new Error("Cannot instantiate an interface.");
    };
}

Object.defineProperty(IPlurified, 'namepath', { value: 'plur/IPlurified' } );
Object.defineProperty(IPlurified, 'implemented', { value: [] } );

return IPlurified;
});
