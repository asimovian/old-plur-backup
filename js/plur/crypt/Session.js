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
 * @constructor plur/crypt/Session
 **
 */
var CryptSession = function() {
    this._cipherKeyMap = new PromiseMap(); // PGP => Keypair
    this._sessionKeyMap = new PromiseMap(); // <PGP Public Key Hash> => Keyset
};

CryptSession.prototype = PlurObject.create('plur/crypt/Session', CryptSession);

CryptSession.prototype.generateKeys = function(cipher) {
    var promise = new PlurPromise(function(resolve, reject) {
        Crypt.get(cipher).then(function(crypt) {
            crypt.generateKeys().then(function(keys) {
                resolve(keys);
            });
        });
    });

    __cipherKeyMap.put(cipher, promise);
    return promise;
};

CryptSession.prototype.encryptData = function(cipher, key, data) {
    var promise = new PlurPromise(function(resolve, reject) {
        Crypt.get(cipher).then(function(crypt) {
            if (!__cipherKeyMap.has(cipher)) {
                this._cipherKeyMap.put(cipher, this.generateKeys(cipher));
            }

            __cipherKeyMap.get(cipher).then(function(keyset) {
                crypt.encrypt(key, keyset, data).then(function(encryptedData) {
                    resolve(encryptedData);
                });
            });
        });
    });

    return promise;
};

CryptSession.prototype.decryptData = function(cipher, key, data) {
    return Crypt.get().decrypt(keys.getPrivateKey(), publicKey, data);
};

CryptSession.prototype.createEncryptModelCallback = function(model) {
    return function(cipher, key, modelTransformer) {
        return encryptData(cipher, key, modelTransformer.encode(model));
    };
};

CryptSession.prototype.createEncryptNextKeyCallback = function() {
    return function(cipher, publicKey);
};

CryptSession.prototype.decryptModel = function(cipher, publicKey, data, modelTransformer) {
    return modelTransformer.decode(__private.decryptData(cipher, publicKey, data));
};