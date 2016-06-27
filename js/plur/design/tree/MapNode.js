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
var MapTreeNode = function(value, parent, key) {
    this._value = value || null;
    this._parent = parent || null;
    this._key = key || null;
    this._children = {};
};

MapTreeNode.prototype = PlurObject.create('plur/design/tree/MapNode', MapTreeNode);
PlurObject.implement(MapTreeNode, ITreeNode);

/**
 * Gets the value for this node.
 *
 * @function plur/design/tree/MapNode.prototype.get
 * @virtual
 * @returns mixed|null value
 */
MapNode.prototype.get = function() {
   return this._value;
};

/**
 * Sets the value for this node.
 *
 * @function plur/design/tree/MapNode.prototype.set
 * @virtual
 * @param mixed value
 * @returns mixed|null
 */
MapNode.prototype.set = function(value) {
    this._value = value;
};

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

/**
 * Retrieves the parent.
 *
 * @function plur/design/tree/MapNode.prototype.parent
 * @returns plur/design/tree/MapNode|null parent
 */
ITreeNode.prototype.parent = function() {
    return this._parent;
};

/**
 * Adds a child.
 *
 * @function plur/design/tree/MapNode.prototype.addChild
 * @param plur/design/tree/MapNode child
 * @returns plur/design/tree/MapNode child
 */
MapTreeNode.prototype.addChild = function(child) {
    if (!child instanceof MapTreeNode) {
        throw new TypeError('Invalid MapTreeNode child', {child: child});
    }

    this._children[child.name()] = child;
    return child;
};

MapTreeNode.prototype.removeChild = function(keyOrChild) {
    if (keyOrChild instanceof MapTreeNode) {
        var child = keyOrChild;
        if (typeof this._children[child.key()] === 'undefined') {
            throw new StateError('Child not found', {key: key})
        }

        child._parent = null;
        delete this._children[child.key()];
    } else if (typeof keyOrChild === 'string') {
        var key = keyOrChild;
        if (typeof this._children[key] === 'undefined') {
            throw new StateError('Child not found', {key: key})
        }

        var child = this._children[key];
        child._parent = null;
        delete this._children[key];
    } else {
        throw new TypeError('Invalid argument', {keyOrChild: keyOrChild});
    }
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


MapTreeNode.prototype.key = function() {
    return this._key;
};

return MapTreeNode;
});