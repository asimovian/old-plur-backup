/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 */
define(['plur/PlurObject'], function(PlurObject) {

/**
 * @param string hashId
 * @param float|undefined trust 1.00 (fully trusted) - 0.00 (not trusted). Default: 0.00
 */
var RemoteNode = function(hashId, trust) {
	this._hashId = hashId;
	this._trust = ( typeof trust === 'undefined' ? 0.00 : trust );
	this._capabilityTrustMap = {};
};

NodeNetwork.prototype = PlurObject.create('plur/node/RemoteNode', NodeNetwork);

NodeNetwork.prototype.getHashId = function() {
	return this._hashId;
};

RemoteNode.prototype.setTrust = function(trust) {
	this._trust = trust;
};

RemoteNode.prototype.getTrust = function() {
	return this._trust;
};

/**
 * @param string capability
 * @param float|undefined trust 1.00 (fully trusted) - 0.00 (not trusted), -1.00 (no capability) Default: 0.00
 */
RemoteNode.prototype.setCapability = function(capability, trust) {
	this._capabilityTrustMap[capability] = trust;
};

/**
 * @returns float|null A numerical 
 */
RemoteNode.prototype.getCapabilityTrust = function(capability) {
	for (var cap in this._capabilityTrustMap) {
		if (cap === capability)
			return this._capabilityTrustMap[cap];
	}
	
	return -1.00;
};

return RemoteNode;
});

