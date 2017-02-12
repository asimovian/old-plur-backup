/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject
 */
 'use strict';

define([
    'plur/PlurObject',
    '../../config/IConfigurable',
    'plur/security/Level',
    'plur/error/Abstract',
    'plur-config/plur/comm/msg/AMessage' ],
function(
    PlurObject,
    IConfigured
    SecurityLevel,
    AbstractError,
    _FILE_CONFIG ) {

/**
 * Parent prototype of Request, Response, and Notification prototypes.
 *
 * @constructor plur/comm/msg/AMessage
 * @abstract
 * @implements plur/comm/msg/IMessage
 * @implements plur/config/IConfigured
 **
 * @param {plur/security/Level|undefined} securityLevel
 * @throws AbstractError On attempt to instantiate directly.
 */
var AMessage = function(securityLevel) {
    if (this.namepath === AMessage.namepath) {
        throw new AbstractError({'this': this});
    }

    this._timestamp = new Date().now();
    this._securityLevel = ( typeof securityLevel !== 'undefined'
        ? securityLevel : this.config().msg.defaultSecurityLevel );
};

AMessage.prototype = PlurObject.create('plur/comm/msg/AMessage', AMessage);
PlurObject.implement(AMessage, IMessage);
PlurObject.implement(AMessage, IConfigured);

Amessage._DEFAULT_CONFIG = new ConstructorConfig(AMessage, null, _FILE_CONFIG, {
    msg: {
        defaultSecurityLevel: SecurityLevel.Levels.CONFIDENTIAL
    }
});

AMessage.getDefaultConfig = function() {
    return AMessage._DEFAULT_CONFIG;
};

/**
 * Retrieves the current config.
 *
 * @function plur/comm/msg/AMessage.prototype.getConfig
 * @returns
 */
AMessage.prototype.getConfig = function() {
    return this._config;
};

/**
 * Retrieves the current configuration.
 *
 * @function plur/comm/msg/AMessage.prototype.config
 * @returns
 */
AMessage.prototype.config = function() {
    return this._config.config();
};

/**
 * Retrieves the creation timestamp.
 *
 * @function plur/comm/msg/AMessage.prototype.getTimestamp
 * @returns int
 */
AMessage.prototype.getTimestamp = function() {
    return this._timestmap;
};

/**
 * Retrieves the security level.
 *
 * @function plur/comm/msg/AMessage.prototype.getSecurityLevel
 * @returns plur/security/Level
 */
AMessage.prototype.getSecurityLevel = function() {
    return this._securityLevel;
};

return AMessage;
});