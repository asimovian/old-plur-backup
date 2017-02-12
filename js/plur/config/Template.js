/**
 * @copyright 2017 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @module plur/config
 */
'use strict';

define([
    'plur/PlurObject',],
function(
    PlurObject ) {

/**
 * @alias Template
 */
class ConfigTemplate {
    static stringVal(regex, value) {};
    static intVal(range, value) {};
    static floatVal(range, precision, value) {};
    static boolVal(value) {};
    static enumVal(values, value) {};

    /**
     * @param {plur/config/IPlurified} subject
     * @param {plur/config/IConfigurable.IStatic} parent
     * @param {(*)|(undefined)} template
     */
    constructor(subject, parent, template) {
        this._subjectNamepath = subject.namepath;
        this._parentTemplate = parent.configTemplate();
        this._defaultConfig = null;
    };

    /**
     * @returns {module:plur/config/IConfig}
     */
    defaultConfig() {
        if (this._defaultConfig === null) {
            this._defaultConfig = this.createConfig();
        }

        return this._defaultConfig;
    };

    /**
     * @param {*} configuration
     * @returns {module:plur/config/IConfig}
     */
    createConfig(configuration) {

    };
}

PlurObject.plurify('plur/config/Template', ConfigTemplate);

return ConfigTemplate;
});