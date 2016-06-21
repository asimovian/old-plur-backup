/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject
 */
 'use strict';

define([
    'plur/PlurObject',
    'plur/log/Log',
    'plur/design/Singleton' ],
function(
    PlurObject,
    Log,
    Singleton ) {

/**
 * Log singleton
 *
 * @constructor plur/log/System
 **
 */
var SystemLog = function() {
    Singleton.call(this, new Log());

    // add listeners that output to console
    var emitter = this.object.emitter();

    emitter.on('info', function(eventType, event) {
        if (typeof event.data.data !== 'undefined')
            console.info(event.data.message, event.data.data);
        else
            console.info(event.data.message);
    });

    emitter.on('error', function(eventType, event) {
        if (typeof event.data.data !== 'undefined')
            console.log(event.data.message, event.data.data);
        else
            console.log(event.data.message);
    });};

SystemLog.prototype = PlurObject.create('plur/log/System', SystemLog, Singleton);

return new SystemLog();
});