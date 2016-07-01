/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject
 */
 'use strict';
 
define([
    'plur/PlurObject',
    'plur/lib/openpgpjs/openpgpjs/openpgp'],
function(
    PlurObject,
    openpgp) {

/**
 * PGP Cryptography
 *
 * @constructor plur/crypto/core/PGP
 **
 */
var PGP = function(config) {
    ACrypt.call(this, PGP.getDefaultConfig());
};

PGP._DEFAULT_CONFIG = new Config(PGP, {
});

PGP._CONFIGS = [ PGP._DEFAULT_CONFIG ];

PGP.getDefaultConfig = function() {
    return PGP._DEFAULT_CONFIG;
};

PGP.getConfigs = function() {
    return PGP._CONFIGS;
};

PGP.prototype = PlurObject.create('plur/crypto/core/PGP', PGP, ACrypt);

PGP.prototype.init = function() {
    openpgp.initWorker({path: 'openpgp.worker.js'}); // start worker
    openpgp.config.aead_protect = true; // enable AES-GCM
    return new Promise(Promise.noop);
};

PGP.prototype.encrypt = function(publicKey, privateKey, data) {
    var options = {
        data: data,
        publicKeys: openpgp.key.readArmored(publicKey).keys,
        privateKeys: openpgp.key.readArmored()
    };

    var promise = new PlurPromise(function(resolve, reject) {
        openpgp.encrypt(options).then(function(ciphertext) {
            resolve(ciphertext.data);
        });
    });

    return promise;
};

PGP.prototype.decrypt = function(publicKey, privateKey, encryptedData) {
    var options = {
        message: openpgp.message.readArmored(encryptedData),
        publicKeys: openpgp.key.readArmored(publicKey).keys,
        privateKey: openpgp.key.readArmored(privateKey).keys[0]
    };

    var promise = new PlurPromise(function(resolve, reject) {
        openpgp.decrypt(options).then(function(plaintext) {
            resolve(plaintext.data);
        });
    });

    return promise;
};

PGP.prototype.generateKeys = function() {
    var options = {
        userIds: [{ name: this.createUUID() }],
        numBits: 4096,
        passphrase: this.createUUID()
    };

    var promise = new PlurPromise(function(resolve, reject) {
        openpgp.generateKey(options).then(function(key) {
            resolve(new Keypair(key.privateKeyArmored, key.publicKeyArmored));
        });
    });

    return promise;
};

return PGP;
});