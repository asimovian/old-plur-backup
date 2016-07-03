/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject
 */
 'use strict';

define([
    'plur/PlurObject',
    'plur/error/Interface' ],
function(
    PlurObject,
    InterfaceError ) {

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
ICrypt.prototype.init = PlurObject.abstractMethod;

// promise
ICrypt.prototype.generateKeyset = PlurObject.abstractMethod;

// promise
ICrypt.prototype.encrypt = PlurObject.abstractMethod;

// promise
ICrypt.prototype.decrypt = PlurObject.abstractMethod;

// promise
ICrypt.prototype.decryptModel = PlurObject.abstractMethod;

// promise
ICrypt.prototype.encryptModel = PlurObject.abstractMethod;

return ICrypt;
});