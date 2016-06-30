/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject
 */
 'use strict';

define([
    'plur/PlurObject',
    'plur/crypt/ICrypt' ],
function(
    PlurObject,
    ICrypt ) {

/**
 * Cryptographic software interface.
 *
 * @constructor plur/crypt/ICrypt
 * @interface
 **
 */
var ICrypt = function() { throw new InterfaceError({'this': this}); };

ICrypt.prototype = PlurObject.create('plur/crypt/ICrypt', ICrypt);

// promise
ICrypt.prototype.generateKeyset = function() {
};

// promise
ICrypt.prototype.encrypt = function(to, from, data) {
};

// promise
ICrypt.prototype.decrypt = function(to, from, data) {
};

// promise
ICrypt.prototype.decryptModel = function(to, from, data, modelTransformer) {
};

// promise
ICrypt.prototype.encryptModel = function(to, from, model, modelTransformer)

return ICrypt;
});