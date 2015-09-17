/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject
 */
 'use strict';

define([
    'plur/PlurObject',
    'plur/model/Model',
    'plur/config/Config' ],
function(
    PlurObject,
    Model,
    Config ) {

/**
 * Data model for Config.
 *
 * @constructor plur/config/ConfigModel
 * @extends plur/model/Model
 **
 */
var ConfigModel = function() {
};

ConfigModel.prototype = PlurObject.create('plur/config/ConfigModel', ConfigModel, Model);

ConfigModel.prototype.model = function(object) {
    return new Config(object.subjectNamepath);
};

ConfigModel.prototype.fromModel = function(model) {
    var o = Model.prototype.call(this, model);
    o.subjectNamepath = this._subjectNamepath;

    // config keys
    for (var key in this) {
        if (Config.isConfigField(key, this[key])) {
            o[key] = this[key];
        }
    }

    return o;
};

return ConfigModel;
});