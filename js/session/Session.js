define(['plur/PlurObject', 'plur/event/Emitter'], function(PlurObject, Emitter) {
	
var Session = function() {
	this.io = new Emitter();
	
	this._id = Session.nextSessionId();
	this._state = Session.State.OPEN;
};

Session.State = {
	OPEN: 'open',
	AUTHENTICATED: 'authenticated',
	CLOSED: 'closed'
};

Session._sessionId = 1;

Session.nextSessionId = function() {
	return Session._sessionId++;
};

Session.prototype = PlurObject.create('plur/session/Session', Session);

Session.prototype.getId = function() {
	return this._id;
};

Session.prototype.setState = function(state) {
	this._state = state;
};

Session.prototype.getState = function(state) {
	return this._state;
};

Session.prototype.close = function() {
	this._state = Session.State.CLOSED;
};

// create system singleton
Session.system = new Session(); // id 1
Session.system.setState(Session.State.AUTHENTICATED);

return Session;
});