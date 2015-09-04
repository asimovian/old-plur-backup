/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject
 */
define(['plur/PlurObject'], function (PlurObject) {

/**
 * The interface that all file system prototypes must provide.
 *
 * @constructor plur/file/ISystem
 * @interface
 */
var IFileSystem = function() {};

IFileSystem.prototype = PlurObject.create('plur/file/ISystem', IFileSystem);

/**
 * Combines the provided paths together into one path.
 *
 * @function plur/file/ISystem.prototype.joinPaths
 * @virtual
 * @param ... string[] paths
 * @returns string
 */
IFileSystem.prototype.joinPaths = PlurObject.pureVirtualFunction;

/**
 * Retrieves the home path for thie Plur software, appending all provided paths.
 *
 * @function plur/file/ISystem.prototype.getHomePath
 * @virtual
 * @param ... string[] paths
 * @returns string
 */
IFileSystem.prototype.getHomePath = PlurObject.pureVirtualFunction;

/**
 * Retrieves the config path for this node instance, appending all provided paths.
 *
 * @function plur/file/ISystem.prototype.getConfigPath
 * @virtual
 * @param ... string[] paths
 * @returns string
 */
IFileSystem.prototype.getConfigPath = PlurObject.pureVirtualFunction;

/**
 * Retrieves the bin path for the Plur software appending all provided paths.
 *
 * @function plur/file/ISystem.prototype.getBinPath
 * @virtual
 * @param ... string[] paths
 * @returns string
 */
IFileSystem.prototype.getBinPath = PlurObject.pureVirtualFunction;


return IFileSystem;
});