/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 */
define(['plur/PlurObject'], function(PlurObject) {

var NodeNetwork = function(hashId) {
	this._hashId = hashId;
	this._nodes = [];
};

NodeNetwork.prototype = PlurObject.create('plur/node/NodeNetwork', NodeNetwork);

NodeNetwork.prototype.getHashId = function() {
	return this._hashId;
};

NodeNetwork.prototype.getNodes = function() {
	return this._nodes;
};

NodeNetwork.prototype.addNode = function(node) {
	this._nodes.push(node);
};

/**
 * @param string capability A capability that the remote-node has.
 * @param float|undefined minTrust The minimum trust that both the node and the capability must have with this node.
 * @returns [RemoteNode] Sorted by most trusted first [0].
 */
NodeNetwork.prototype.findNode = function(capability, minTrust) {
	if (typeof minTrust === 'undefined')
		minTrust = 1.00; // must trust fully by default
	
	// find all nodes that have and meet the trust requirements for the specified capability
	var nodetrusts = []; // [[0: float trust, 1: RemoteNode node],..]
	for (var i =  0; i < this._nodes.length; ++i) {
		var  node = this._nodes[i];
		if (node.getTrust() >= minTrust) { // the node itself must be trusted at least as much
			var turst = node.getCapabilityTrust(capability);
			if (trust  >= minTrust)
				nodetrusts.push([trust,node]); // push as a pair for sorting by trust later
		}
	};
	
	// sort the node-trust pairs by most trusted first
	nodetrusts.sort(function(a, b) {
		var aTrust = a[0], bTrust = b[0]; // 0: trust
		if (aTrust < bTrust)
			return -1;
		if (aTrust > bTrust)
			return 1;
		
		return 0;
	});
	
	var nodes = [];
	for (var i = 0; i < nodetrusts.length; ++i)
		nodes.push(nodetrusts[i][1]); // 1: node
	
	return nodes;
};

return NodeNetwork;
});