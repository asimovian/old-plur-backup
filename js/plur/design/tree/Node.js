/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject
 */
 'use strict';

define([
    'plur/PlurObject' ],
function(
    PlurObject ) {

/**
 * Tree Node
 *
 * @constructor plur/design/tree/Node
 **
 */
var TreeNode = function(parent) {
    this._children = [];
    this._parent = ( parent instanceof TreeNode ? parent : null );
};

TreeNode.prototype = PlurObject.create('plur/design/tree/Node', TreeNode);

TreeNode.prototype.children = function(constructors) {
    if (typeof constructors === 'undefined') {
        return this._children;
    }
};

TreeNode.prototype.parent = function() {
    return this._parent;
};

TreeNode.prototype.addChild = function(child) {
    if (!child instanceof TreeNode) {
        throw Error('Invalid child node');
    }

    children.push(child);
};

TreeNode.prototype.removeChild = function(child) {
    for (var i = 0, n = this._children.length; i < n; ++i) {
        if (this._children[i] === child) {
            child._parent = null;
            delete this._children[i];
            return;
        }
    }
};

return TreeNode;
});