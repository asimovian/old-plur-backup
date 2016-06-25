/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject
 */
 'use strict';

define([
    'plur/PlurObject',
    'plur/design/tree/INode' ],
function(
    PlurObject,
    ITreeNode ) {

/**
 * Tree Node
 *
 * @constructor plur/design/tree/Node
 * @implements plur/design/tree/INode
 **
 */
var ListTreeNode = function(parent) {
    this._children = [];
    this._parent = ( parent instanceof ListTreeNode ? parent : null );
};

ListTreeNode.prototype = PlurObject.create('plur/design/tree/ListNode', ListTreeNode);
PlurObject.implement(ListTreeNode, ITreeNode);

ListTreeNode.prototype.children = function(constructors) {
    if (typeof constructors === 'undefined') {
        return this._children;
    }
};

ListTreeNode.prototype.parent = function() {
    return this._parent;
};

ListTreeNode.prototype.child = function(index) {
    return ( this._children[index] || null );
};

ListTreeNode.prototype.hasChild = function(indexOrChild) {
    if (indexOrChild instanceof ListTreeNode) {
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

ListTreeNode.prototype.addChild = function(child) {
    if (!child instanceof ListTreeNode) {
        throw Error('Invalid child node');
    }

    children.push(child);
    return child;
};

ListTreeNode.prototype.removeChild = function(child) {
    for (var i = 0, n = this._children.length; i < n; ++i) {
        if (this._children[i] === child) {
            child._parent = null;
            delete this._children[i];
            return;
        }
    }
};

ListTreeNode.prototype.isRoot = function() {
    return ( this._parent === null );
};

ListTreeNode.prototype.root = function() {
    var branch = this;
    while (branch._parent !== null) {
        branch = branch._parent;
    }

    return branch;
};

ListTreeNode.prototype.empty = function() {
    return ( this._children.length === 0 );
};

ListTreeNode.prototype.isLeaf = function() {
    return (this._parent !== null && this.empty() );
};

return ListTreeNode;
});