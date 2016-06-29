/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject
 */
 'use strict';

define([
    'plur/PlurObject',
    'plur/error/Interface' ],
function(
    PlurObject,
    InterfaceError ) {

/**
 * Tree Node Interface
 *
 * @constructor plur/design/tree/INode
 * @interface
 **
 */
var ITreeNode = function() { throw new InterfaceError({'this': this}); };

ITreeNode.prototype = PlurObject.create('plur/design/tree/INode', ITreeNode);

/**
 * Gets the value for this node.
 *
 * @function plur/design/tree/INode.prototype.get
 * @abstract
 * @returns mixed|null value
 */
ITreeNode.prototype.get = PlurObject.abstractMethod;

/**
 * Sets the value for this node.
 *
 * @function plur/design/tree/INode.prototype.set
 * @abstract
 * @param mixed value
 * @returns mixed|null
 */
ITreeNode.prototype.set = PlurObject.abstractMethod;

/**
 * Retrieves children of this node.
 * If a constructor is provided, only children that are instances of such will be returned.
 *
 * @function plur/design/tree/INode.prototype.children
 * @param Function instanceOfConstructor|undefined Filters out all children that are not derived from this constructor
 * @returns plur/design/tree/INode[] children
 */
ITreeNode.prototype.children = PlurObject.abstractMethod;

/**
 * Retrieves the parent.
 *
 * @function plur/design/tree/INode.prototype.parent
 * @abstract
 * @returns plur/design/tree/INode|null parent
 */
ITreeNode.prototype.parent = PlurObject.abstractMethod;

/**
 * Adds a child.
 *
 * @function plur/design/tree/INode.prototype.addChild
 * @abstract
 * @param plur/design/tree/INode child
 * @returns plur/design/tree/INode child
 */
ITreeNode.prototype.addChild = PlurObject.abstractMethod;

/**
 * Removes a child.
 *
 * @function plur/design/tree/INode.prototype.removeChild
 * @abstract
 * @param plur/design/tree/INode child
 */
ITreeNode.prototype.removeChild = PlurObject.abstractMethod;


/**
 * Determines whether a child exists or not.
 *
 * @function plur/design/tree/INode.prototype.hasChild
 * @param plur/design/tree/INode child The child to search for.
 * @returns boolean hasChild TRUE if child exists. FALSE if not.
 */
ITreeNode.prototype.hasChild = PlurObject.abstractMethod;

/**
 * Determines whether this node is the root node of the tree or not.
 *
 * @function plur/design/tree/INode.prototype.isRoot
 * @abstract
 * @returns boolean TRUE if this node is the root of the tree, FALSE if not
 */
ITreeNode.prototype.isRoot = PlurObject.abstractMethod;

/**
 * Retrieves the root node for this tree.
 *
 * @function plur/design/tree/INode.prototype.root
 * @abstract
 * @returns plur/design/tree/INode root
 */
ITreeNode.prototype.root = PlurObject.abstractMethod;

/**
 * Determines whether this node is childless or not.
 *
 * @function plur/design/tree/INode.prototype.isLeaf
 * @abstract
 * @returns boolean
 */
ITreeNode.prototype.isLeaf = PlurObject.abstractMethod;

/**
 * Factory method that creates a new child branch chain, each subsequent child branch corresponding to its index in the
 * provided array.
 *
 * @function plur/design/tree/INode.prototype.expand
 * @param string[] treeList An array to be walked. An array of arrays specifies multiple branches, and can be complex.
 *      | {} treeMap A map to be walked. Can be complex.
 * @param Function valueConstructor Will construct a value object and fill the new node
 *      | Function(plur/design/tree/INode parent := plur/design/tree/INode newChild) constructionCallback
 *          A callback can be used to manually create and return each child.
 * @returns plur/design/tree/INode newLeaves[] All new leaf nodes are returned
 */
ITreeNode.prototype.expand = PlurObject.abstractMethod;

return ITreeNode;
});