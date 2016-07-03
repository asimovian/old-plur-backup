/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject plur/event/Emitter
 */
define([
    'plur/PlurObject',
    'plur/event/Emitter' ],
function(
    PlurObject,
    Emitter ) {
	
var UserSession = function(authenticationKeyset) {
	this._state = UserSession.State.OPEN;
	this._emitter = new Emitter();

    var __private = new UserSession._Private(this, authenticationKeyset);

    this._close = __private.close();
    this._publicKey = __private.publicKey;
    this._publicKeyHash = __private.publicKeyHash;
    this._getAuthenticationPublicKey = __private._getAuthenticationPublicKey;
    this._getAuthenticationPublicKeyHash = __private._getAuthenticationPublicKeyHash;
};

UserSession.prototype = PlurObject.create('plur/user/Session', UserSession);

UserSession._Private = function(session, authenticationKeyset) {
	this._emitter = new Emitter();
    this._cryptoSession = new CryptoUserSession();
    this._authenticationKeyset = authenticationKeyset;
};

UserSession._Private = PlurObject.create('plur/user/Session._Private', UserSession._Private);

UserSession._Private.prototype.close = function() {
    this._emitter = null;
    this._cryptoUserSession = null;
};

UserSession._Private.prototype.getAuthenticationPublicKey = function() {
    return this._authenticationKeyset.getPublicKey();
};

UserSession._Private.prototype.getAuthenticationPublicKeyHash = function() {
    return this._authenticationKeyset.getPublicKeyHash();
};

UserSession.States = {
    NEW: 0x00,
	OPEN: 0x01,
	CLOSED: 0x10,
};

UserSession.prototype.publicKey = function() {
    return this._publicKey();
};

UserSession.prototype.publicKeyHash = function() {
    return this._publicKeyHash();
};

UserSession.prototype.getAuthenticationPublicKey = function() {
    return this._getAuthenticationPublicKey();
};

UserSession.prototype.getAuthenticationPublicKeyHash = function() {
    return this._getAuthenticationPublicKeyHash();
};

UserSession.prototype.emitter = function() {
    return this._emitter;
};

UserSession.prototype.getState = function() {
	return this._state;
};

UserSession.prototype.isOpen = function() {
    return this._state === UserSession.States.OPEN;
};

UserSession.prototype.close = function() {
	this._state = UserSession.States.CLOSED;
	this._emitter.destroy();
	this._close();
};

return UserSession;
});