/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @module plur/error/Error
 */
define([
    'plur/PlurObject',
    'plur/ITransformable' ],
function(
    PlurObject,
    ITransformable ) {

/**
 * Errors thrown by the plur internal platform.
 *
 * @class PlurError
 * @alias {module:plur/error/Error}
 * @extends Error
 */
class PlurError extends Error {
    static throwIf(testResult, message, data) {
        if (testResult) {
            throw new PlurError(message, data);
        }
    };

    static fromModel(model) {
        return new PlurError(model.message, model.data);
    };

    static _stringifyReplacer(key, value) {
        switch (typeof value) {
            case 'undefined':
                return 'undefined';
            case 'function':
                return '[Function]';
            default:
                return value;
        };
    };

    /**
     * @param {string|undefined} message
     * @param {*} data
     */
    constructor(message, data) {
        /** @type {string} **/
        this.name = this.namepath;
        /** @type {string|undefined} **/
        this.message = message;
        /** @type {*} **/
        this.data = ( typeof data === 'undefined' ? null : data );

        Error.captureStackTrace(this, this.constructor);
    };

    /**
     * @returns {string}
     */
    toString() {
        if (this.data === null)
            return 'Error (' + this.name + '): ' + this.message;

        return 'Error (' + this.name + '): ' + this.message + ' ; ' + JSON.stringify(this.data, PlurError._stringifyReplacer);
    };

    /**
     * @returns {{message: (string|undefined), data: (*)}}
     */
    model() {
        return {
            message: this.message,
            data: IModel.model(this.data)
        };
    };
}

PlurObject.purify('plur/error/Error', PlurError, [ ITransformable ]);

return PlurError;
});