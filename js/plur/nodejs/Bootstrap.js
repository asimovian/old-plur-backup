/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject
 */
 'use strict';

define([
    'plur/PlurObject',
    'plur/bootstrap/Bootstrap',
    'plur/file/System',
    'plur/nodejs/file/System' ],
function(
    PlurObject,
    Bootstrap,
    FileSystem,
    NodeJsFileSystem ) {

/**
 * NodeJS NodeJsBootstrap
 *
 * @constructor plur/nodejs/Bootstrap
 * @extends plur/bootstrap/Bootstrap
 **
 */
var NodeJsBootstrap = function(platformBootstrap) {
    Bootstrap.call(this, platformBootstrap) ;

    // initialize the local file system api
    FileSystem.initLocal(new NodeJsFileSystem());
};

NodeJsBootstrap.prototype = PlurObject.create('plur/nodejs/Bootstrap', NodeJsBootstrap, Bootstrap);

NodeJsBootstrap.init = function(platformNodeJsBootstrap) {
    Bootstrap.init(new NodeJsBootstrap(platformNodeJsBootstrap));
};

NodeJsBootstrap.get = function() {
    return Bootstrap.singleton;
};

return NodeJsBootstrap;
});