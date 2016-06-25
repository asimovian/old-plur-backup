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
 * Tree backed by a {} map.
 *
 * @constructor plur/design/tree/MapNode
 * @implements plur/design/tree/INode
 **
 */
var MapTreeNode = function(parent, key) {
    this._parent = parent || null;
    this._key = key || null;
    this._children = {};
};

MapTreeNode.prototype = PlurObject.create('plur/design/tree/MapNode', MapTreeNode);
PlurObject.implement(MapTreeNode, ITreeNode);

/**
 * Retrieves children of this node.
 * If a constructor is provided, only children that are instances of such will be returned.
 *
 * @function plur/design/tree/MapNode.prototype.children
 * @param Function instanceOfConstructor|undefined Filters out all children that are not derived from this constructor
 * @returns plur/design/tree/MapNode[]
 */
MapTreeNode.prototype.children = function(instanceOfConstructor) {
    var children = PlurObject.values(this._children);

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

MapTreeNode.prototype.key = function() {
    return this._key;
};

MapTreeNode.prototype.addChild = function(child, key) {
    if (typeof key !== 'undefined') {
        this._children[key] = child;
    } else {
        this._children[child._key] = child;
    }

    return child;
};

MapTreeNode.prototype.removeChild = function(keyOrChild) {
    if (keyOrChild instanceof MapTreeNode) {
        var child = keyOrChild;
        if (typeof this._children[child.key()] === 'undefined') {
            throw new Assertion('Child not found')
        }

        child._parent = null;
        delete this._children[child.key()];
    } else if (typeof keyOrChild === 'string') {
        var key = keyOrChild;
        if (typeof this._children[key] === 'undefined') {
            throw new Assertion('Child not found')
        }

        var child = this._children[key];
        child._parent = null;
        delete this._children[key];
    } else {
        throw Assertion('Invalid argument');
    }
};


MapTreeNode.prototype.empty = function() {
    return ( PlurObject.values(this._children).length === 0 );
};

/**
 * Factory method that creates a new child branch chain, each subsequent child branch corresponding to a key in the
 * provided array.
 *
 * @function plur/design/tree/MapNode.prototype.expand
 * @param Function treeNodeConstructor The MapTreeNode constructor to use when creating new nodes
 *      | Function
 * @param string[] keys
 *      | {} treeMap A map to be walked
 * @returns plur/design/tree/MapNode leafBranch
 */
 MapTreeNode.prototype.expand = function(treeNodeConstructor, keys) {
    var branch = this;

    if (Array.isArray(keys)) {
        for (var i = 0, n = keys.length; i < n; ++i) {
            var key = keys[i];

            if (branch.key() === key) {
                continue;
            } else if (branch.hasChild(key)) {
                branch = branch.child(key);
            } else {
                //TODO: if (PlurObject.isConstructor(treeNodeConstructor)) {
                branch = branch.addChild(new treeNodeConstructor(branch, key));
            }
        }
    } else { // treeMap
        for (var key in keys) {
                //TODO: if (PlurObject.isConstructor(treeNodeConstructor)) {
                branch = branch.addChild(new treeNodeConstructor(branch, key));
                branch.expand(treeMap[key]);
        }
    }

    return branch;
};

return MapTreeNode;
});