/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject plur/file/ISystem
 */
define([
    'plur/PlurObject',
    'plur/file/ISystem' ],
function (
    PlurObject,
    IFileSystem ) {

/**
 * A simple abstract base class for all file systems, both local and remote.
 *
 * @constructor plur/file/System
 * @abstract
 */
var FileSystem = function() {
	this._configPath = this.joinPaths(this._getHomePath(), FileSystem.DirNames.config);
	this._binPath = this.joinPaths(this._getHomePath(), FileSystem.DirNames.bin);
};

FileSystem.prototype = PlurObject.create('plur/file/System', FileSystem);

PlurObject.implement(FileSystem, IFileSystem);

FileSystem.DirNames = {
    bin: 'bin',
    config: 'config'
};

FileSystem._local = null;

FileSystem.local = function() {
    return FileSystem._local;
};

FileSystem.initLocal = function(localFileSystem) {
    FileSystem._local = localFileSystem;
};

/**
 * Combines the provided paths together into one path.
 *
 * @function plur/file/System.prototype.joinPaths
 * @abstract
 * @param ... string[] paths
 * @returns string
 */
FileSystem.prototype.joinPaths = function(/* ... */) {
    var pathSeparator = this.getPathSeparator();
    var path = arguments[0]; // base path

    for (var i = 0; i < arguments.length; ++i) {
        // any absolute path is automatically accepted (other than the base path)
        if (arguments[i].charAt(0) === pathSeparator) {
            // throw an error if there are more paths after this one as that's unexpected
            if (i+1 !== arguments.length) {
                throw Error('Unexpected absolute path in list of arguments.')
            }

            path += pathSeparator + arguments[i];
        }
    }

    return path;
};

/**
 * Retrieves the home path for thie Plur software, appending all provided paths.
 *
 * @function plur/file/System.prototype.getHomePath
 * @param ... string[] paths
 * @returns string
 */
FileSystem.prototype.getHomePath = function (/* ... */) {
    if (arguments.length === 0) {
        return this._getHomePath();
    }

	return this.joinPaths.apply(this, ([this._homePath].concat(arguments)));
};

/**
 * Retrieves the config path for this node instance, appending all provided paths.
 *
 * @function plur/file/System.prototype.getConfigPath
 * @param ... string[] paths
 * @returns string
 */
FileSystem.prototype.getConfigPath = function(/* ... */) {
	return this.joinPaths.apply(this, [this._configPath].concat(arguments));
};

/**
 * Retrieves the bin path for the Plur software appending all provided paths.
 *
 * @function plur/file/System.prototype.getBinPath
 * @param ... string[] paths
 * @returns string
 */
FileSystem.prototype.getBinPath = function(/* ... */) {
	return this.joinPaths.apply(this, [this._binPath].concat(arguments));
};

/**
 * Retrieves the home path for thie Plur software.
 *
 * @function plur/file/System.prototype._getHomePath
 * @abstract
 * @param ... string[] paths
 * @returns string
 */
FileSystem.prototype._getHomePath = PlurObject.abstractMethod;

/**
 * Retrieves the path separator.
 *
 * @function plur/file/System.prototype.getPathSeparator
 * @abstract
 * @returns string
 */
FileSystem.prototype.getPathSeparator = PlurObject.abstractMethod;

return FileSystem;
});
