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
var ListTreeNode = function(parent, parentIndex, value) {
    this._parent = parent || null;
    this._parentIndex = index;
    this._value = value || null;
    this._children = [];
};

ListTreeNode.prototype = PlurObject.create('plur/design/tree/ListNode', ListTreeNode);
PlurObject.implement(ListTreeNode, ITreeNode);

/**
 * Gets the value for this node.
 *
 * @function plur/design/tree/ListNode.prototype.get
 * @returns mixed|null value
 */
ListTreeNode.prototype.get = function() {
   return this._value;
};

/**
 * Sets the value for this node.
 *
 * @function plur/design/tree/ListNode.prototype.set
 * @param mixed value
 * @returns mixed|null
 */
ListTreeNode.prototype.set = function(value) {
    this._value = value;
};

/**
 * Retrieves children of this node.
 * If a constructor is provided, only children that are instances of such will be returned.
 *
 * @function plur/design/tree/ListNode.prototype.children
 * @param Function instanceOfConstructor|undefined Filters out all children that are not derived from this constructor
 * @returns plur/design/tree/ListNode[]
 */
ListTreeNode.prototype.children = function(instanceOfConstructor) {
    var children = this._children;

    if (PlurObject.isConstructor(instanceOfConstructor)) {
        var filtered = [];
        for (var i = 0, n = children.length; ++i) {
            if (children[i] instanceof instanceOfConstructor) {
                filtered.push(children[i]);
            }
        }

        children = filtered;
    }

    return children;
};

ListTreeNode.prototype.parent = function() {
    return this._parent;
};

ListTreeNode.prototype.child = function(childOrIndex) {
    return ( this._children[index] || null );
};

ListTreeNode.prototype.hasChild = function(childOrIndex) {
    if (childOrIndex instanceof ListTreeNode) {
        for (var i = 0, n = this._children.length; i < n; ++i) {
            if (this._children[i] === childOrIndex) {
                return true;
            }
        }

        return false;
    } else {
        return ( typeof this._children[childOrIndex] !== 'undefined' );
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

ListTreeNode.prototype.isLeaf = function() {
    return (this._parent !== null && this.empty() );
};

ListTreeNode.prototype.index = function() {
    return this._index;
};

ListTreeNode.prototype.insertChild = function(child, siblingOrIndex) {
    if (typeof siblingOrIndex === 'number') {
        var index = siblingOrIndex;
        if (index > this._children.length || index < 0) {
           throw new BoundsError('Index overflow', {siblingOrIndex: siblingOrIndex}) ;
        } if (index === this._children.length) {
            this._children.push(child);
            child._index = index;
        } else{
            var children = this._children = this._children.splice(0, index -1);
            children.push(child);
            this._children = children.concat(this._children.splice(index));
            child._index = index;
            this._children[index+1]._index++;
        }

    } else if (siblingOrIndex instanceof ListTreeNode) {
        var sibling = siblingOrIndex;

    } else {
        throw new TypeError('Invalid siblingOrIndex', {siblingOrIndex: siblingOrIndex});
    }
};

return ListTreeNode;
});