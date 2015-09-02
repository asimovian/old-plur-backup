var util = require('util');
var stream = require('stream');

var JsonChunkReadStream = function() {
	stream.Stream.call(this);
	this.readable = true;
	this.writable = true;
};

util.inherits(JsonChunkReadStream, stream.Stream);

JsonChunkReadStream.prototype._read = function(size) {
	return true;
};

JsonChunkReadStream.prototype.write = function(data) {
	data = data.toString();
	var start = 0, end = 0;
	while (start < data.length) {
		end = data.indexOf("\n", start);
		if (end === -1)
			return false;

		var json = data.substring(start, end);
		var obj = JSON.parse(json);
		this.emit('data', JSON.stringify(obj.msg));
		start = end+1;
		end = 0;
	}

	return true;
};

JsonChunkReadStream.prototype.end = function() {
	this.emit('end');
};

module.exports = JsonChunkReadStream;