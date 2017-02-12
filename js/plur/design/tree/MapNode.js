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
 * @returns mixed|null value
 */
MapTreeNode.prototype.get = function() {
   return this._value;
};

/**
 * Sets the value for this node.
 *
 * @function plur/design/tree/MapNode.prototype.set
 * @param mixed value
 * @returns mixed|null
 */
MapTreeNode.prototype.set = function(value) {
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
        for (var i = 0, n = children.length; i < n; ++i) {
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
MapTreeNode.prototype.parent = function() {
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

    this._children[child.key()] = child;
    return child;
};

/**
 * Removes a child.
 *
 * @function plur/design/tree/MapTreeNode.prototype.removeChild
 * @param plur/design/tree/MapTreeNode childOrKey
 *      | string key
 */
 MapTreeNode.prototype.removeChild = function(childOrKey) {
    if (childOrKey instanceof MapTreeNode) {
        var child = childOrKey;
        if (typeof this._children[child.key()] === 'undefined') {
            throw new StateError('Child not found', {key: key})
        }

        child._parent = null;
        delete this._children[child.key()];
    } else if (typeof childOrKey === 'string') {
        var key = childOrKey;
        if (typeof this._children[key] === 'undefined') {
            throw new StateError('Child not found', {key: key})
        }

        var child = this._children[key];
        child._parent = null;
        delete this._children[key];
    } else {
        throw new TypeError('Invalid argument', {childOrKey: childOrKey});
    }
};

/**
 * Determines whether a child exists or not.
 *
 * @function plur/design/tree/MapNode.prototype.hasChild
 * @param plur/design/tree/MapNode|string childOrKey The child to search for.
 * @returns boolean hasChild TRUE if child exists. FALSE if not.
 */
MapTreeNode.prototype.hasChild = function(childOrKey) {
    if (typeof childOrKey === 'string') {
        return ( typeof this._children[childOrKey] !== 'undefined' ) ;
    } else if (childOrKey instanceof MapTreeNode) {
        var child = childOrKey;
        for (var key in this._children) {
            if (typeof this._children[key] === child) {
                return true;
            }
        }

        return false;
    } else {
        throw new TypeError('Invalid childOrKey', {childOrKey: childOrKey});
    }
};


/**
 * Retrieves the specified child.
 *
 * @function plur/design/tree/MapNode.prototype.child
 * @param string key
 * @returns plur/design/tree/MapNode|null child NULL if not found.
 */
MapTreeNode.prototype.child = function(key) {
    if (typeof this._children[key] !== 'undefined') {
        return this._children[key];
    }

    return null;
};

/**
 * Determines whether this node is the root node of the tree or not.
 *
 * @function plur/design/tree/MapNode.prototype.isRoot
 * @returns boolean TRUE if this node is the root of the tree, FALSE if not
 */
MapTreeNode.prototype.isRoot = function() {
    return ( this._parent === null );
};

/**
 * Retrieves the root node for this tree.
 *
 * @function plur/design/tree/MapNode.prototype.root
 * @returns plur/design/tree/MapNode root
 */
MapTreeNode.prototype.root = function() {
    var branch = this;
    while (branch._parent !== null) {
        branch = branch._parent;
    }

    return branch;
};

/**
 * Determines whether this node is childless or not.
 *
 * @function plur/design/tree/MapNode.prototype.isLeaf
 * @returns boolean
 */
MapTreeNode.prototype.isLeaf = function() {
    return ( Object.keys(this._children).length === 0 );
};

/**
 * Factory method that creates a new child branch chain, each subsequent child branch corresponding to its main in the
 * provided array.
 *
 * If the provided skeleton uses string keys as elements, children will be constructed using the constructor. Otherwise,
 * pre-created MapTreeNode elements will be added.
 *
 * @function plur/design/tree/MapNode.prototype.expand
 * @param string[] treeList An array to be walked. An array of arrays specifies multiple branches, and can be complex.
 *      | {} treeMap A map to be walked. Can be complex.
 * @param Function valueConstructor Will construct a value object and fill the new node
 *      | Function(plur/design/tree/INode parent := plur/design/tree/INode newChild) constructionCallback
 *          A callback can be used to manually create and return each child.
 * @returns plur/design/tree/INode newLeaves[] All new leaf nodes are returned
 */
 MapTreeNode.prototype.expand = function(treeList, valueConstructor) {
    var branch = this;

    if (Array.isArray(treeList)) {
        for (var i = 0, n = treeList.length; i < n; ++i) {
            var key = treeList[i];

            if (branch.key() === key) {
                continue;
            } else if (branch.hasChild(key)) {
                branch = branch.child(key);
            } else {
                //TODO: if (PlurObject.isConstructor(valueConstructor)) {
                branch = branch.addChild(new MapTreeNode(new valueConstructor(), branch, key));
            }
        }
    } else { // treeMap
        var treeMap = treeList;
        for (var key in treeMap) {
                //TODO: if (PlurObject.isConstructor(valueConstructor)) {
                branch = branch.addChild(new MapTreeNode(new valueConstructor(), branch, key));
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