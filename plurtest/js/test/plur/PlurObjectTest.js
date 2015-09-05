/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject
 */
define([
    'plur/PlurObject' ],
function(
    PlurObject ) {

/**
 *
 *
 * @constructor test/plur/PlurObjectTest
 * @test plur/PlurObject
 **
 */
var PlurObjectTest = function() {
};

PlurObjectTest.prototype = PlurObject.create('test/plur/PlurObjectTest', PlurObjectTest);

/**
 * @function test/plur/PlurObject.testCreate
 * @test plur/PlurObject.create
 */
PlurObjectTest.prototype.testCreate = function() {
};

/**
 * @function test/plur/PlurObject.testModel
 * @test plur/PlurObject.model
 */
PlurObjectTest.prototype.testModel = function() {
};

/**
 * @function test/plur/PlurObject.testCreateFromModel
 * @test plur/PlurObject.createFromModel
 */
 PlurObjectTest.prototype.testCreateFromModel = function() {
};

return PlurObjectTest;
});