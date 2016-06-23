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
        this._children[child.name] = child;
    }
};

NamedTreeNode.prototype.removeChild = function(nameOrChild) {
    if (nameOrChild instanceof TreeNode) {
        return TreeNode.prototype.removeChild.call(this, child);
    }

    var name = nameOrChild;
    var child = this._children[nameOrChild];
    if (child instanceof TreeNode) {
        child._parent = null;
        delete this._children[name];
    }
};

NamedTreeNode.prototype.children = function() {
    return Object.values(this._children);
};

return NamedTreeNode;
});