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
    _FILE_CONFIG ) {

/**
 * Singleton container for Crypt.
 *
 * @constructor plur/crypt/CryptSingleton
 * @extends plur/design/Singleton
 **
 */
var CryptSingleton = function() {
    APromiseMapSingleton.call(this, CryptSingleton.getDefaultConfig(), function(key) {
        var cryptConfig = Config.fromModel(CryptSingleton.CipherConfigs[key]);

        var promise = new PlurPromise(function(resolve, reject) {
            Bootstrap.get().require([cryptoConfig.configuredNamepath], function(cryptConstructor) {
                resolve(new cryptConstructor(cryptConfig));
            });
        };
    });

    this._ciphers = {};

    // create Ciphers enum
    var ciphers = this.config().cryptSingleton.ciphers;
    for (var key in ciphers.symmetric) {
        this._ciphers[key] = ciphers.symmetric[key];
    }

    for (var key in ciphers.asymmetric) {
        this._ciphers[key] = ciphers.asymmetric[key];
    }

    this.Ciphers = this.getCiphers();
};

CryptSingleton.prototype = PlurObject.create('plur/crypt/Singleton', CryptSingleton, APromiseMapSingleton);

CryptSingleton._DEFAULT_CONFIG = new ConstructorConfig(CryptSingleton, APromiseMapSingleton, _FILE_CONFIG, {
    cryptSingleton: {
        ciphers: {
            symmetric: {
                AES256: new Config('plur/crypt/symmetric/AES', {
                    keySize: 256
                }),
                AES192: new Config('plur/crypt/symmetric/AES', {
                    keySize: 192
                })
            },

            asymmetric: {
                PGP: new Config('plur/crypt/asymmetric/PGP'),
            },

            labels: {
                SecurityLevel.Levels.PUBLIC: {
                    symmetric: 'PGP',
                    asymmetric: 'AES192'
                },

                SecurityLevel.Levels.CONFIDENTIAL: {
                    symmetric: 'PGP',
                    asymmetric: 'AES256'
                },

                SecurityLevel.Levels.SECRET: {
                    symmetric: 'PGP',
                    asymmetric: 'AES256'
                },

                SecurityLevel.Levels.TOPSECRET: {
                    symmetric: 'PGP',
                    asymmetric: 'AES256'
                },
            },
        },
    }
});

CryptSingleton.getDefaultConfig = function() {
    return CryptSingleton._DEFAULT_CONFIG;
};

CryptSingleton.prototype.get = function(labelCipher, symmetry) {
    if (typeof symmetry === 'undefined') {
        var cipher = labelOrCipher;
        return APromiseMapSingleton.prototype.get.call(this, cipher) ;
    } else {
        var label = labelOrCipher;
        return APromiseMapSingleton.prototype.get.call(this, this.config().cryptSingleton.ciphers.labels[label][symmetry]);
    }
};

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