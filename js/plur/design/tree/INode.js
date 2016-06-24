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

ITreeNode.prototype.children = PlurObject.pureVirtualFunction;
//function(constructors) {

ITreeNode.prototype.parent = PlurObject.pureVirtualFunction;
//function() {
//    return this._parent;

ITreeNode.prototype.child = PlurObject.pureVirtualFunction;
//function(index) {
//    return ( this._children[index] || null );

ITreeNode.prototype.hasChild = PlurObject.pureVirtualFunction;
//function(indexOrChild) {
//                return true;

ITreeNode.prototype.addChild = PlurObject.pureVirtualFunction;
//function(child) {
//        throw Error('Invalid child node');
//    return child;

ITreeNode.prototype.removeChild = PlurObject.pureVirtualFunction;
//function(child) {
//            return;

ITreeNode.prototype.isRoot = PlurObject.pureVirtualFunction;
//function() {
//    return ( this._parent === null );

ITreeNode.prototype.root = PlurObject.pureVirtualFunction;
//function() {
//    return branch;

ITreeNode.prototype.empty = PlurObject.pureVirtualFunction;
//function() {
//    return ( this._children.length === 0 );

ITreeNode.prototype.isLeaf = PlurObject.pureVirtualFunction;
//function() {
//    return (this._parent !== null && this.empty() );

return ITreeNode;
});