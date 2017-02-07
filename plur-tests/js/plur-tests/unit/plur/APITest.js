/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject
 */
 'use strict';

define([
    'plur/PlurObject',
    'plur/test/Test',
    'plur/API' ],
function(
    PlurObject,
    Test,
    API ) {

/**
 * Test
 *
 * @constructor plur-tests/unit/plur/APITest
 * @extends plur/test/Test
 * @tests plur/API
 **
 */
var APITest = function() {
    Test.call(this);
};

APITest.prototype = PlurObject.create('plur-tests/unit/plur/APITest', APITest, Test);

APITest.prototype.testValues = function() {
    this.assertHas(API, 'version', '0.0.0');
    this.assertHas(API, 'scmUrl', 'git://github.com/asimovian/plur.git');
    this.assertHas(API, 'branch', 'master');
};

return APITest;
});