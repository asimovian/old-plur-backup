/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject
 */
 'use strict';

define([
    'plur/PlurObject',
    'plur/design/Singleton',
    'plur/crypt/Crypt' ],
function(
    PlurObject,
    Singleton,
    Crypt ) {

/**
 * Singleton container for Crypt.
 *
 * @constructor plur/crypt/CryptSingleton
 * @extends plur/design/Singleton
 **
 */
var CryptSingleton = function() {
    PromiseMapSingleton.call(this, function(key) {
        var cryptConfig = CryptSingleton.CipherConfigs[key];
        var promise = new PlurPromise(function(resolve, reject) {
            Bootstrap.get().require([cryptoConfig.configuredNamepath], function(cryptConstructor) {
                resolve(new cryptConstructor(cryptConfig));
            });
        };
    });

    this._config = CryptSingleton.DEFAULT_CONFIG;

    // load ciphers
    var ciphers = this._config.config().ciphers;
    for (var key in ciphers) {
        CryptSingleton.Ciphers[key] = key;
        CryptSingleton.CipherConfigs[key] = ciphers[key];
    }
};

CryptSingleton.DEFAULT_CONFIG = new Config(CryptSingleton, {
    ciphers: {
        PGP: new Config('plur/crypt/core/PGP', {}),

        AES256: new Config('plur/crypt/core/AES', {
            keySize: 256
        })
    }
});

CryptSingleton.prototype = PlurObject.create('plur/crypt/CryptSingleton', CryptSingleton, APromiseMapSingleton);

/**
 * Cryptographic configurations available to the core platform.
 */
CryptSingleton.Ciphers = {};

CryptSingleton.CipherConfigs = {}

return new CryptSingleton();
});