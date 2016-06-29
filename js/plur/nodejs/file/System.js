/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires fs plur/PlurObject plur/file/System plur/config/Config
 */
define([
	'fs',
	'plur/PlurObject',
	'plur/file/System' ],
function(
	fs,
	PlurObject,
	FileSystem ) {

/**
 * Represents the underlying File System through Node.JS.
 *
 * @constructor plur/nodejs/file/System
 * @extends plur/file/System
 */
var NodeJsFileSystem = function() {
	this._homePath = fs.realpathSync('../');
};

NodeJsFileSystem.prototype = PlurObject.create('plur/nodejs/file/System', NodeJsFileSystem, FileSystem);

/**
 * Retrieves the home path for thie Plur software.
 *
 * @function plur/nodejs/file/System.prototype._getHomePath
 * @abstract
 * @param ... string path
 * @returns string
 */
NodeJsFileSystem.prototype._getHomePath = function() {
    return this._homePath;
};

/**
 * Retrieves the path separator.
 *
 * @function plur/nodejs/file/System.prototype.getPathSeparator
 * @abstract
 * @returns string
 */
NodeJsFileSystem.prototype.getPathSeparator = function() {
    return '/';
};

return NodeJsFileSystem;
});