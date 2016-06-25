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
 * Tree Node Interface
 *
 * @constructor plur/design/tree/INode
 **
 */
var ITreeNode = function() {};

ITreeNode.prototype = PlurObject.create('plur/design/tree/INode', ITreeNode);

/**
 *
 *
 * @function plur/design/tree/INode.prototype.
 * @param
 * @returns
 */

/**
 * Retrieves children of this node.
 * If a constructor is provided, only children that are instances of such will be returned.
 *
 * @function plur/design/tree/INode.prototype.children
 * @param Function instanceOfConstructor|undefined Filters out all children that are not derived from this constructor
 * @returns plur/design/tree/INode[] children
 */
ITreeNode.prototype.children = PlurObject.pureVirtualFunction;

/**
 * Retrieves the parent.
 *
 * @function plur/design/tree/INode.prototype.parent
 * @virtual
 * @returns plur/design/tree/INode|null parent
 */
ITreeNode.prototype.parent = PlurObject.pureVirtualFunction;

/**
 * Retrieves a specific child by the given identifier.
 *
 * @function plur/design/tree/INode.prototype.
 * @virtual
 * @param []|{}|string|int|float identifier
 * @returns plur/design/tree/INode|null child
 */
ITreeNode.prototype.child = PlurObject.pureVirtualFunction;

/**
 * Determines whether a child with the provided identifier currently exists or not.
 *
 * @function plur/design/tree/INode.prototype.hasChild
 * @virtual
 * @param []|{}|string|int|float identifier
 * @returns boolean hasChild TRUE if child exists, FALSE if not
 */
ITreeNode.prototype.hasChild = PlurObject.pureVirtualFunction;

/**
 * Adds a child.
 *
 * @function plur/design/tree/INode.prototype.addChild
 * @virtual
 * @param plur/design/tree/INode child
 * @returns plur/design/tree/INode child
 * @throws PlurError On invalid child
 */
ITreeNode.prototype.addChild = PlurObject.pureVirtualFunction;

/**
 * Removes a child.
 *
 * @function plur/design/tree/INode.prototype.removeChild
 * @virtual
 * @param plur/design/tree/INode child
 */
ITreeNode.prototype.removeChild = PlurObject.pureVirtualFunction;

/**
 * Determines whether this node is the root node of the tree or not.
 *
 * @function plur/design/tree/INode.prototype.
 * @virtual
 * @param
 * @returns
 */
ITreeNode.prototype.isRoot = PlurObject.pureVirtualFunction;
//function() {
//    return ( this._parent === null );

/**
 * Retrieves the root node for this tree.
 *
 * @function plur/design/tree/INode.prototype.
 * @virtual
 * @param
 * @returns
 */
ITreeNode.prototype.root = PlurObject.pureVirtualFunction;
//function() {
//    return branch;

/**
 * Determines whether this node is a leaf and lacks important data or not.
 *
 * @function plur/design/tree/INode.prototype.
 * @virtual
 * @returns boolean TRUE if empty, FALSE if not
 */
ITreeNode.prototype.empty = PlurObject.pureVirtualFunction;
//function() {
//    return ( this._children.length === 0 );

/**
 * Determines whether this node is childless or not.
 *
 * @function plur/design/tree/INode.prototype.
 * @virtual
 * @param
 * @returns
 */
ITreeNode.prototype.isLeaf = PlurObject.pureVirtualFunction;
//function() {
//    return (this._parent !== null && this.empty() );

return ITreeNode;
});