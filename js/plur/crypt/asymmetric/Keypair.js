/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject
 */
 'use strict';

define([
    'plur/PlurObject' ],
function(
    PlurObject ) {

/**
 * Stores a public and private key.
 * All operations return copies.
 *
 * @constructor plur/crypt/Keypair
 **
 * @param string privateKey
 * @param string publicKey
 */
var Keypair = function(privateKey, publicKey) {
    var __private = {
        privateKey: privateKey; // copy to new string
        publicKey: publicKey; // copy to new string
    };

    this.__getPrivateKey = function() { return ''+__private.privateKey; };
    this.__getPublicKey = function() { return ''+__private.publicKey; };
};

Keypair.prototype = PlurObject.create('plur/crypt/Keypair', Keypair);
PlurObject.implement(Keypair, IKeyset);

Keypair.prototype.getPrivateKey = function() {
    return this.__getPrivateKey();
};

Keypair.prototype.getPublicKey = function() {
    return this.__getPublicKey();
};

return Keypair;
});

