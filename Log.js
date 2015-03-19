define(['plur/event/Emitter'], function(Emitter) {
	
var Log = function() {
	this.emitter = new Emitter();
};

Log.prototype.debug = function(message, data) {
	this.emitter.emit('debug', { type: 'debug', message: message, data: data });
};

Log.singleton = new Log();

return Log.singleton;
});
