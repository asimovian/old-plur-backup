/**
 * @copyright 2017 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @module plur/crypt/Session
 */
'use strict';

define([
    'plur/PlurObject',
    'plur/crypt/Crypt' ],
function(
    PlurObject,
    Crypt ) {

/**
 * @class CryptSession
 * @alias {module:plur/crypt/Session}
 */
class CryptSession {
    constructor() {
        this._cipherKeyMap = new PromiseMap(); // PGP => Keypair
        this._sessionKeyMap = new PromiseMap(); // <PGP Public Key Hash> => Keyset
    };

    generateKeys(cipher) {
        let promise = new PlurPromise(function (resolve, reject) {
            Crypt.get(cipher).then(function (crypt) {
                crypt.generateKeys().then(function (keys) {
                    resolve(keys);
                });
            });
        });

        __cipherKeyMap.put(cipher, promise);
        return promise;
    };

    encryptData(cipher, key, data) {
        let promise = new PlurPromise(function (resolve, reject) {
            Crypt.get(cipher).then(function (crypt) {
                if (!__cipherKeyMap.has(cipher)) {
                    this._cipherKeyMap.put(cipher, this.generateKeys(cipher));
                }

                __cipherKeyMap.get(cipher).then(function (keyset) {
                    crypt.encrypt(key, keyset, data).then(function (encryptedData) {
                        resolve(encryptedData);
                    });
                });
            });
        });

        return promise;
    };

    decryptData(cipher, key, data) {
        return Crypt.get().decrypt(keys.getPrivateKey(), publicKey, data);
    };

    createEncryptModelCallback(model) {
        return function (cipher, key, modelTransformer) {
            return encryptData(cipher, key, modelTransformer.encode(model));
        };
    };

    createEncryptNextKeyCallback() {
        return new function (cipher, publicKey) {};
    };

    decryptModel(cipher, publicKey, data, modelTransformer) {
        return modelTransformer.decode(__private.decryptData(cipher, publicKey, data));
    };
}

PlurObject.plurify('plur/crypt/Session', CryptSession);

return CryptSession;
});