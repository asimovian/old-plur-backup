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
 * @constructor plurtest/plur/PlurObjectTest
 * @extends plur/test/Test
 * @test plur/PlurObject
 **
 */
var PlurObjectTest = function() {
};

PlurObjectTest.prototype = PlurObject.create('plurtest/plur/PlurObjectTest', PlurObjectTest, Test);

/**
 * @function plurtest/plur/PlurObject.testCreate
 * @test plur/PlurObject.create
 */
PlurObjectTest.prototype.testCreate = function(expected) {
    // test create
    (function() {
        var Alpha = function() {
            this.o = 'a';
        };

        Alpha.prototype = PlurObject.create('plurtest/plur/PlurObject/testCreate/Alpha', Alpha);

        Alpha.prototype.a = 'a';

        this.assertConstruction({
            constructor: Alpha,
            namepath: 'plurtest/plur/PlurObject/testCreate/alpha'
        });

        var alpha = new A();
        this.assertOwns(alpha, 'o', 'a');

        var Bravo = function() {
            this.constructor.prototype.constructor.call(this);
            this.o += '->b'
        };

        Bravo.prototype = PlurObject.create('plurtest/plur/PlurObject/testCreate/Bravo', Bravo);

        Bravo.prototype.b = 'b';

        this.assertConstruction({
            constructor: Bravo,
            parentConstructor: Alpha,
            namepath: 'plurtest/plur/PlurObject/testCreate/bravo',
        });

        var bravo = new B();
        this.assertHas(bravo, 'a', 'a');
        this.assertHas(bravo, 'b', 'b');
        this.assertHas(bravo, 'o', 'a->b');
    });
};

return PlurObjectTest;
});