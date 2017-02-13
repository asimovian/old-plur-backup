/**
 * @copyright 2017 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @module plur/config
 */
'use strict';

define([
    'plur/PlurObject',
    'plur/error/Interface' ],
function(
    PlurObject,
    InterfaceError ) {

/**
 * Interface for any configurable prototype.
 *
 * @interface
 */
class IConfigurable {
    constructor() {
        throw new InterfaceError(this);
    };
}

PlurObject.plurify('plur/config/IConfigurable', IConfigurable);

/**
 * @interface
 */
IConfigurable.IStatic = class {
    constructor() {
        throw new InterfaceError(this);
    };
}

/**
 * @returns {plur/config/ITemplate}
 */
IConfigurable.IStatic.prototype.configTemplate = PlurObject.abstractMethod;

/**
 * @returns {plur/config/IConfig}
 */
IConfigurable.prototype.getConfig = PlurObject.abstractMethod;

/**
 * @returns {{(string):(*)}}
 */
IConfigurable.prototype.config = PlurObject.abstractMethod;


return IConfigurable;
});