/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 */
define(['plur/websocket/WebsocketClientService'], function(WebsocketClientService) {
	
var DojoWebsocketClientService = function(node) {
	WebsocketClientService.call(this, node);
};

DojoWebsocketClientService.prototype = Object.create(WebsocketClientService.prototype);
DojoWebsocketClientService.prototype.constructor = DojoWebsocketClientService;

DojoWebsocketClientService.prototype._connect = function(url, options) {
	var websocket = dojox.socket(url);
	var websocketEmitter = new WebsocketEmitter(websocket);
	return websocketEmitter;
};

return DojoWebsocketClientService;
});