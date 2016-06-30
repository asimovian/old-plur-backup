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
var CryptPromiseMapSingleton = function() {
    var available = [ICrypt.PGP]
    PromiseMapSingleton.call(this, function(key) {
        if (typeof )
    });

    var cryptConfig = CryptSingleton._createCryptConfig();
    //TODO: research race condition on .get() before Bootstrap.require() has finished
    // add promises to require()?
    Bootstrap.get().require([cryptoConfig.subjectNamepath], function(cryptConstructor) {
        Singleton.call(this, new cryptConstructor(cryptConfig));
    });
};

CryptPromiseMapSingleton.prototype = PlurObject.create('plur/crypt/CryptSingleton', CryptPromiseMapSingleton, AFutureMapSingleton);

CryptPromiseMapSingleton.prototype. = function(configKey) {
};

Crypt.get().get(Crypt.PGP).then(function(crypt) {
    crypt.decrypt().then(function(decrypted) {
        // blah ...
    });
});

Crypt.get().put(Crypt.PGP)


return new CryptPromiseMapSingleton();
});