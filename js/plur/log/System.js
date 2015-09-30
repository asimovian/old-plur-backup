/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject
 */
 'use strict';

define([
    'plur/PlurObject',
    'plur/design/Singleton' ],
function(
    PlurObject,
    Singleton ) {

/**
 * Log singleton
 *
 * @constructor plur/log/System
 **
 */
var SystemLog = function() {
    Singleton.call(this, new Log());
};

SystemLog.prototype = PlurObject.create('plur/log/System', SystemLog, Singleton);

SystemLog.singleton = new SystemLog();

return SystemLog.singleton;
});