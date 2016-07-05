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
    PromiseMapSingleton.call(this, function(key) {
        var cryptConfig = Config.fromModel(CryptSingleton.CipherConfigs[key]);
        var promise = new PlurPromise(function(resolve, reject) {
            Bootstrap.get().require([cryptoConfig.configuredNamepath], function(cryptConstructor) {
                resolve(new cryptConstructor(cryptConfig));
            });
        };
    });

    this._config = CryptSingleton.getDefaultConfig();;

    // load ciphers
    var ciphers = this.config().ciphers;
    for (var key in ciphers) {
        CryptSingleton.Ciphers[key] = key;
        CryptSingleton.CipherConfigs[key] = ciphers[key];
    }

    this.Ciphers = this.getCiphers();
};

CryptSingleton.prototype = PlurObject.create('plur/crypt/Singleton', CryptSingleton, APromiseMapSingleton);

CryptSingleton._DEFAULT_CONFIG = new ConstructorConfig(CryptSingleton, ASingleton, __FILE_CONFIG, {
    crypt: {
        SecurityLevel.Levels.PUBLIC: {
            symmetric: {
                ciphers: {
                    AES256: new Config('plur/crypt/symmetric/AES', {
                        keySize: 256
                    })
                }
            },

            asymmetric: {
                ciphers: {
                    PGP: new Config('plur/crypt/asymmetric/PGP'),
                }
            }
        },

        SecurityLevel.Levels.CONFIDENTIAL: {
            symmetric: {
                ciphers: {
                    AES256: new Config('plur/crypt/symmetric/AES', {
                        keySize: 256
                    })
                }
            },

            asymmetric: {
                ciphers: {
                    PGP: new Config('plur/crypt/asymmetric/PGP'),
                }
            }
        },

        SecurityLevel.Levels.SECRET: {
            symmetric: {
                ciphers: {
                    AES256: new Config('plur/crypt/symmetric/AES', {
                        keySize: 256
                    })
                }
            },

            asymmetric: {
                ciphers: {
                    PGP: new Config('plur/crypt/asymmetric/PGP'),
                }
            }
        },

        SecurityLevel.Levels.TOPSECRET: {
            symmetric: {
                ciphers: {
                    AES256: new Config('plur/crypt/symmetric/AES', {
                        keySize: 256
                    })
                }
            },

            asymmetric: {
                ciphers: {
                    PGP: new Config('plur/crypt/asymmetric/PGP'),
                }
            }
        },
    }
});

CryptSingleton.getDefaultConfig = function() {
    return CryptSingleton._DEFAULT_CONFIG;
};

CryptSingleton.prototype.get = function(securityLevelOrCipher, symmetry) {
    if (typeof symmetry === 'undefined') {
        var cipher = securityLevelOrCipher;
        return APromiseMapSingleton.call(this, cipher) ;
    } else {
        var securityLevel = securityLevelOrCipher;
        return APromiseMapSingleton.call(this, this.config().crypt[securityLevel][symmetry]);
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