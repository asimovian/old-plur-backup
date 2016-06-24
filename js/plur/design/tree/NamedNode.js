/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject
 */
 'use strict';

define([
    'plur/PlurObject',
    'plur/design/tree/Node' ],
function(
    PlurObject,
    TreeNode ) {

/**
 * Named Tree Node
 *
 * @constructor plur/design/tree/NamedNode
 **
 */
var NamedTreeNode = function(parent, name) {
    TreeNode.call(this, parent);

    this._name = name || null;
    this._children = {};
};

NamedTreeNode.prototype = PlurObject.create('plur/design/tree/NamedNode', NamedTreeNode, TreeNode);

NamedTreeNode.prototype.name = function() {
    return this._name;
};

NamedTreeNode.prototype.addChild = function(child, name) {
    if (typeof name !== 'undefined') {
        this._children[name] = child;
    } else {
        this._children[child._name] = child;
    }

    return child;
};

NamedTreeNode.prototype.removeChild = function(nameOrChild) {
    if (nameOrChild instanceof NamedTreeNode) {
        var child = nameOrChild;
        if (typeof this._children[child.name()] === 'undefined') {
            throw new Assertion('Child not found')
        }

        child._parent = null;
        delete this._children[child.name()];
    } else if (typeof nameOrChild === 'string') {
        var name = nameOrChild;
        if (typeof this._children[name] === 'undefined') {
            throw new Assertion('Child not found')
        }

        var child = this._children[name];
        child._parent = null;
        delete this._children[name];
    } else {
        throw Assertion('Invalid argument');
    }
};

NamedTreeNode.prototype.children = function() {
    return PlurObject.values(this._children);
};

NamedTreeNode.prototype.empty = function() {
    return ( PlurObject.values(this._children).length === 0 );
};

/**
 * Factory method that creates new child tree nodes (as needed) starting from this branch that correspond to the provided names.
 *
 * @function plur/design/tree/NamedNode.prototype.appendTree
 * @param string[] names
 * @returns plur/design/tree/NamedNode leafBranch
 */
 NamedTreeNode.prototype.expand = function(treeNodeConstructor, names) {
    var branch = this;

    for (var i = 0, n = names.length; i < n; ++i) {
        var name = names[i];

        if (branch.name() === name) {
            continue;
        } else if (branch.hasChild(name)) {
            branch = branch.child(name);
        } else {
            branch = branch.addChild(new treeNodeConstructor(branch, name));
        }
    }

    return branch;
};


return NamedTreeNode;
});