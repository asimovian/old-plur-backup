/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject plur/test/Test
 */
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
    function assertObject(expected) {
        let object = new expected.constructor.apply(null, expected.constructionArguments);

        // interfaces for comparison
        let expectedImplemented = {};
        for (let interface in expected.interfaces) {
            expectedImplemented[interface.namepath] = null;
        }

        // check constructor
        this.assert(object.constructor, expected.constructor);
        // check parent constructor
        this.assert(object.constructor.prototype.constructor, expected.parentConstructor)
        // check constructor implement method
        this.assert(object.constructor.implement, PlurObject.implement)
        // check constructor implemented
        this.assertEquals(object.constructor.implemented, expectedImplemented)
        // check constructor namepath
        this.assertOwns(object.constructor, 'namepath', expected.namepath);
        // check prototype namepath
        this.assertOwns(object.prototype, 'namepath', expected.namepath);
        // check prototype implements method
        this.assertOwns(object.prototype, 'implements', PlurObject.implements);
    }

    // test create
    (function() {
        var Alpha = function() {
            this.o = 'a';
        };

        Alpha.prototype = PlurObject.create('test/plur/PlurObject/testCreate/Alpha', Alpha);

        Alpha.prototype.a = 'a';

        this.assertConstruction({
            constructor: Alpha
            namepath: 'test/plur/PlurObject/testCreate/alpha',
        });

        let alpha = new A();
        this.assertOwns(alpha, 'o', 'a');

        var Bravo = function() {
            this.constructor.prototype.constructor.call(this);
            this.o += '->b'
        };

        Bravo.prototype = PlurObject.create('test/plur/PlurObject/testCreate/Bravo', Bravo);

        Bravo.prototype.b = 'b';

        this.assertConstruction({
            constructor: Bravo,
            parentConstructor: Alpha
            namepath: 'test/plur/PlurObject/testCreate/bravo',
        });

        let bravo = new B();
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