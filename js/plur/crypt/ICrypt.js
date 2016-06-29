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
 * ICryptographic utilities.
 *
 * @constructor plur/crypt/ICrypt
 **
 */
var ICrypt = function(config) {
    this._config = config || {};
};

ICrypt.prototype = PlurObject.create('plur/crypt/ICrypt', ICrypt);

ICrypt.prototype.generateKeypair = function() {
};

ICrypt.prototype.encrypt = function(privateKey, publicKey, data) {
};

ICrypt.prototype.decrypt = function(privateKey, publicKey, data) {
};

ICrypt.prototype.decryptObject = function(privateKey, publicKey, data) {
};

return ICrypt;
});