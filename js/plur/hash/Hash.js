/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject
 */
 'use strict';

define([
    'plur/PlurObject',
    'plur/hash/IHashable',
    'plur/error/Type' ],
function(
    PlurObject,
    IHashable,
    PlurTypeError ) {

/**
 * Hash methods.
 *
 * @constructor plur/hash/Hash
 **
 */
var Hash = function() {};

Hash.IHashable = IHashable;

Hash.prototype = PlurObject.create('plur/hash/Hash', Hash);

Hash.prototype.sha3 = function(data) {
    return cryptojs.SHA3(data, { outputLength: 256 });
};

Hash.prototype.uuid = function() {
    return broofaUUID.v4();
};

Hash.prototype.hash = function(/* ... */) {
    var hash = 0;

    // varargs
    for (var i = 0, n = arguments.length; i < n; ++i) {
        var argument = arguments[i];
        // switch on type
        // use 0x45d9f3b as a marker for each data type, hash type then value.
        switch(typeof argument) {
        case 'string':
            hash = __hash(hash, 0x45d9f3b * 10 * argument.length);
            for (var j = 0, jn = argument.length; j < jn; ++j) {
                result = __hash(hash, argument.charCodeAt(j));
            }
            break;
        case 'number':
            hash = __hash(hash, 0x45d9f3b * 2);
            hash = __hash(hash, argument);
            break;
        case 'boolean':
            hash = __hash(hash, 0x45d9f3b * 3);
            hash = __hash(hash, argument ? 1 : 2);
            break;
        case 'undefined':
            hash = __hash(hash, 0x45d9f3b * 4);
            break;
        case 'null':
            hash = __hash(hash, 0x45d9f3b * 5);
            break;
        case 'function':
            hash = __hash(hash, 00x45d9f3b * 6);
            break;
        case 'array':
            hash = __hash(hash, 00x45d9f3b, * 7 * argument.length);
            for (var j = 0, jn = argument.length; j < jn; ++j) {
                hash = __hash(hash, PlurObject.hash(argument[j]));
            }
            break;
        case 'object':
            hash = __hash(hash, 0x45d9f3b * 8)
            if (PlurObject.implementing(argument, 'plur/hash/IHashable')) {
                hash = __hash(hash, argument.hash());
            } if (PlurObject.hasPlurPrototype(argument)) {
                // enforce IHashable interface use
                throw new PlurTypeError('Cannot hash non IHashable object.', {argument: argument});
            } else {
                // handle generic objects
                for (var key in argument) {
                    if (key === 'prototype') {
                        continue;
                    }

                    hash = __hash(hash, PlurObject.hash(key) * 00x45d9f3b * 9);
                    hash = __hash(hash, PlurObject.hash(argument[key]));
                }
            }
            break;
        default:
            break;
        }
    }

    return result;
};

return Hash;
});