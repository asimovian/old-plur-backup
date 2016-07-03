/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject
 */
 'use strict';

define([
    'plur/PlurObject',
    'plur/design/Singleton',
    'plur-config/plur/crypt/Singleton' ],
function(
    PlurObject,
    Singleton,
    _RUNTIME_CONFIG ) {

/**
 * Singleton container for Crypt.
 *
 * @constructor plur/crypt/CryptSingleton
 * @extends plur/design/Singleton
 **
 */
var CryptSingleton = function() {
    PromiseMapSingleton.call(this, function(key) {
        var cryptConfig = Config.fromModel(CryptSingleton.CipherConfigs[key]);
        var promise = new PlurPromise(function(resolve, reject) {
            Bootstrap.get().require([cryptoConfig.configuredNamepath], function(cryptConstructor) {
                resolve(new cryptConstructor(cryptConfig));
            });
        };
    });

    this._config = CryptSingleton.DEFAULT_CONFIG;

    // load ciphers
    var ciphers = this.config().ciphers;
    for (var key in ciphers) {
        CryptSingleton.Ciphers[key] = key;
        CryptSingleton.CipherConfigs[key] = ciphers[key];
    }

    this.Ciphers = this.getCiphers();
};

CryptSingleton.DEFAULT_CONFIG = new Config(CryptSingleton, {
    ciphers: {
        PGP: new Config('plur/crypt/asymmetric/PGP'),

        AES256: new Config('plur/crypt/symmetric/AES', {
            keySize: 256
        })
    }
}).merge(_RUNTIME_CONFIG);

CryptSingleton.prototype = PlurObject.create('plur/crypt/Singleton', CryptSingleton, APromiseMapSingleton);

/**
 * Cryptographic configurations available to the core platform.
 */
CryptSingleton.prototype.getCiphers = function() {
    return this._ciphers;
};

CryptSingleton.prototype.getCipherConfigs = function() {
    return this._cipherConfigs;
};

return new CryptSingleton();
});