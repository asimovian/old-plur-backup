/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 */
var util = require('util');
var stream = require('stream');

var JsonChunkWriteStream = function() {
	stream.Stream.call(this);
	this.readable = true;
	this.writable = true;
};

util.inherits(JsonChunkWriteStream, stream.Stream);

JsonChunkWriteStream.prototype._read = function(size) {
	return true;
};

JsonChunkWriteStream.prototype.write = function(data) {
	var packet = {
		rcvd: Date.now(),
		msg: JSON.parse(data)
	};
	
	var line = JSON.stringify(packet) + "\n";
	this.emit('data', line);
};

JsonChunkWriteStream.prototype.end = function() {
	this.emit('end');
};

module.exports = JsonChunkWriteStream;