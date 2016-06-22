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

    emitter.on('info', function(event) {
        var data = event.getData();
        if (typeof data.logEntry.data !== 'undefined')
            console.info(data.logEntry.message, data.logEntry.data);
        else
            console.info(data.logEntry.message);
    });

    emitter.on('error', function(event) {
        var data = event.getData();
        if (typeof data.logEntry.data !== 'undefined')
            console.error(data.logEntry.message, data.logEntry.data);
        else
            console.error(data.logEntry.message);
    });};

SystemLog.prototype = PlurObject.create('plur/log/System', SystemLog, Singleton);

return new SystemLog();
});