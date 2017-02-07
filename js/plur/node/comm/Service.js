/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject plur/service/Service plur/websocket/WebsocketService plur/session/Session
 */
define([
	'plur/PlurObject',
	'plur/service/AService',
	'plur/websocket/WebsocketService',
	'plur/session/Session'],
function(
	PlurObject,
	AService,
	WebsocketService,
	Session) {

/**
 * Handles core node-to-node communication, including handshakes.
 *
 * @constructor plur/node/comm/Service
 * @extends plur/service/AService
 * @param plur/node/PlurNode
 */
var CommService = function(plurNode, config) {
	AService.call(this, plurNode, CommService.DEFAULT_CONFIG.merge(config));
};

CommService.prototype = PlurObject.create('plur/node/IndexService', CommService, AService);


CommService.prototype.start = function() {
	Service.prototype.start.call(this);
};

CommService.prototype.stop = function() {
	Service.prototype.stop.call(this);
};

CommService.prototype._startPrivate = function(__private) {
    __private.emitter().on(CommService.CommNotification, function(messageEvent)) {
        var commNotification = messageEvent.getMessage();
        var commServicePublicKey = commNotification.commServicePublicKey;

    });
};
	
return CommService;
});