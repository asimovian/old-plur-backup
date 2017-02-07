/**
 * @copyright 2016 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject
 * @module plur/PlurAPI
 */
define([
    'plur/PlurObject' ],
function(
    PlurObject ) {

/**
 * API version information
 *
 * @class PlurAPI
 * @alias {module:plur/PlurAPI}
 **
 */
class PlurAPI {
    constructor(version, scmUrl, branch) {
        this.version = version;
        this.scmUrl = scmUrl;
        this.branch = branch;
    };
}

PlurObject.plurify('plur/plurAPI', PlurAPI);

PlurAPI.singleton = new PlurAPI(
    '0.0.0',
    'git://github.com/asimovian/plur.git',
    'master'
);

return PlurAPI.singleton;
});
