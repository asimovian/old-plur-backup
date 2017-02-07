/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 */
define(['plur/PlurObject', 'plur/websocket/WebsocketClientService', 'web/plur/dom/websocket/DomWebsocket'],
function(PlurObject, WebsocketClientService, DomWebsocket) {
	
var DomWebsocketClientService = function(node) {
	WebsocketClientService.call(this, node);
};

DomWebsocketClientService.prototype = PlurObject.create('web/plur/dom/websocket/DomWebsocketClientService',
	DomWebsocketClientService,
	WebsocketClientService
);

DomWebsocketClientService.prototype._connect = function(url, options) {
	var websocket = new DomWebsocket(url, options);
	return websocket;
};

return DomWebsocketClientService;
});