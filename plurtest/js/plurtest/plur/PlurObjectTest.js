/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject plur/test/Test
 */
 'use strict';

define([
    'plur/PlurObject',
    'plur/test/Test' ],
function(
    PlurObject,
    Test) {

/**
 *
 *
 * @constructor test/plur/PlurObjectTest
 * @extends plur/test/Test
 * @test plur/PlurObject
 **
 */
var PlurObjectTest = function() {
};

PlurObjectTest.prototype = PlurObject.create('test/plur/PlurObjectTest', PlurObjectTest, Test);

/**
 * @function test/plur/PlurObject.testCreate
 * @test plur/PlurObject.create
 */
PlurObjectTest.prototype.testCreate = function(expected) {
    // test create
    (function() {
        var Alpha = function() {
            this.o = 'a';
        };

        Alpha.prototype = PlurObject.create('test/plur/PlurObject/testCreate/Alpha', Alpha);

        Alpha.prototype.a = 'a';

        this.assertConstruction({
            constructor: Alpha,
            namepath: 'test/plur/PlurObject/testCreate/alpha'
        });

        var alpha = new A();
        this.assertOwns(alpha, 'o', 'a');

        var Bravo = function() {
            this.constructor.prototype.constructor.call(this);
            this.o += '->b'
        };

        Bravo.prototype = PlurObject.create('test/plur/PlurObject/testCreate/Bravo', Bravo);

        Bravo.prototype.b = 'b';

        this.assertConstruction({
            constructor: Bravo,
            parentConstructor: Alpha,
            namepath: 'test/plur/PlurObject/testCreate/bravo',
        });

        var bravo = new B();
        this.assertHas(bravo, 'a', 'a');
        this.assertHas(bravo, 'b', 'b');
        this.assertHas(bravo, 'o', 'a->b');
    });
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