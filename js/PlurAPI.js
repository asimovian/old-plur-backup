/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 */
define(['plur/PlurObject', function(PlurObject) {

/**
 * API version information
 * @var plur/PlurAPI
 */
var PlurAPI = function() {
    this.namepath = 'plur/PlurAPI';
    this.version = '0.0.0';
    this.scmUrl = 'git://github.com/asimovian/plur.git';
    this.branch = 'master';
};

PlurAPI.prototype = PlurObject.create('plur/PlurAPI', PlurAPI);

/**
 * @var PlurAPI plur/PlurAPI.singleton
 */
PlurAPI.singleton = new PlurAPI();

return PlurAPI;
});
