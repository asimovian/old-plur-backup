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

return NamedTreeNode;
});