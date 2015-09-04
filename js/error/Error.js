/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject
 */
define(['plur/PlurObject', function(PlurObject) {

/**
 * Errors thrown by the plur internal platform.
 *
 * @constructor plur/error/Error
 * @extends Error
 * @params message
 */
var PlurError = function(message, errorType, data) {
    Error.call(this, ''+message);
    this.errorType = ( typeof errorType === 'undefined' ? PlurError.Types.Generic : errorType );
    this.data = ( typeof data === 'undefined' ? null : data );
};

PlurError.prototype = PlurObject.create('plur/error/Error', PlurError, Error);

/**
 * Enum for types of errors.
 * @var plur/error/PlurError.Types
 */
PlurError.Types = {
    /**
     * Generic errors ; catchall
     * @var plur/Error/PlurError.Types.Generic
     **/
    Generic: 0,

    /**
     * Unsupported operation
     * @var plur/Error/PlurError.Types.Unsupported
     */
    Unsupported: 1
};

PlurError.prototype.fromObj = function(obj, instance) {
	if (typeof instance === 'undefined') {
		instance = new PlurError(obj.message);
	} else {
		instance.message = obj.message;
	}
	
	return instance;
};

PlurError.prototype.toObj: function() {
    var o = this.prototype.toObj();
    o.namepath = this.namepath;
    o.message = this.message;
    return o;
};

return PlurError;
});