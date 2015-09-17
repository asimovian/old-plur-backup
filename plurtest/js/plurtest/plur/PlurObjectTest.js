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
    var Alpha = function() {
        this.o = 'a';
    };

    Alpha.prototype = PlurObject.create('plurtest/plur/PlurObject/testCreate/Alpha', Alpha);

    Alpha.prototype.a = 'a';

    this.assertCreation({
        constructor: Alpha,
        namepath: 'plurtest/plur/PlurObject/testCreate/Alpha'
    });

    var alpha = new Alpha();
    this.assertOwns(alpha, 'o', 'a');

    var Bravo = function() {
        Alpha.call(this);
        this.o += '->b'
    };

    Bravo.prototype = PlurObject.create('plurtest/plur/PlurObject/testCreate/Bravo', Bravo, Alpha);

    Bravo.prototype.b = 'b';

    this.assertCreation({
        constructor: Bravo,
        parentConstructor: Alpha,
        namepath: 'plurtest/plur/PlurObject/testCreate/Bravo',
    });

    var bravo = new Bravo();
    this.assertHas(bravo, 'a', 'a');
    this.assertHas(bravo, 'b', 'b');
    this.assertHas(bravo, 'o', 'a->b');
};

return PlurObjectTest;
});