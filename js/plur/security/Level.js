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
 * Security levels
 *
 * @constructor plur/security/Level
 **
 */
var Level = function(label) {
    this._label = label;
};

Level.prototype = PlurObject.create('plur/security/Level', Level);

Level.Levels = {
    PUBLIC: new SecurityLevel('PUBLIC', 0x0);
    CONFIDENTIAL: new SecurityLevel('CONFIDENTIAL', 0x01));
    SECRET: new SecurityLevel('SECRET', 0x02));
    TOPSECRET: new SecurityLevel('TOPSECRET', 0x04));
};

Level.prototype.getLabel = function() {
    return this._label;
};

return Level;
});
