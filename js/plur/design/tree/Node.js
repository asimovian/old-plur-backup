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

TreeNode.prototype.child = function(index) {
    return ( this._children[index] || null );
};

TreeNode.prototype.hasChild = function(indexOrChild) {
    if (indexOrChild instanceof TreeNode) {
        for (var i = 0, n = this._children.length; i < n; ++i) {
            if (this._children[i] === indexOrChild) {
                return true;
            }
        }

        return false;
    } else {
        return ( typeof this._children[indexOrChild] !== 'undefined' );
    }
};

TreeNode.prototype.addChild = function(child) {
    if (!child instanceof TreeNode) {
        throw Error('Invalid child node');
    }

    children.push(child);
    return child;
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

TreeNode.prototype.isRoot = function() {
    return ( this._parent === null );
};

TreeNode.prototype.root = function() {
    var branch = this;
    while (branch._parent !== null) {
        branch = branch._parent;
    }

    return branch;
};

TreeNode.prototype.empty = function() {
    return ( this._children.length === 0 );
};

TreeNode.prototype.isLeaf = function() {
    return (this._parent !== null && this.empty() );
};

return TreeNode;
});