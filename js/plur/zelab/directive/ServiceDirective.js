/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject plur/directive/Directive
 */
define(['plur/PlurObject', 'plur/directive/Directive'], function(PlurObject, Directive) {

/**
 * Represents specific services that are required to succeed along with any pre-requisites necessary.
 *
 * @var plur/service/ServiceDirective
 * @extends plur/directive/Directive
 **
 * @function plur/service/ServiceDirective
 * @param {} options Configuration parameters {
 *     plur/service/Directive[] | undefined requirements Sub-component services
 *     { string key: value } | undefined performanceExpectations Minimum/maximums for various performance criterion
 *     { string key: value } | undefined serviceConfiguration Specific configuration parameters necessary
 * }
 */
var ServiceDirective = function(options) {
    Directive.call(this, options);

    this._performanceExpectations = ( typeof options.performanceExpectations !== 'undefined' ? options.performanceExpectations : [] );
    this._serviceConfiguration = ( typeof options._serviceConfiguration !== 'undefined' ? options._serviceConfiguration : [] );
};

ServiceDirective.prototype = PlurObject.create('plur/service/ServiceDirective', ServiceDirective, Directive);

/**
 * Retrieves performance expectations in terms of ranges and solid values; transaction speed, timeouts, etc.
 * These relate to more abstract concepts of service configuration.
 *
 * @function plur/service/ServiceDirective.prototype.getPerformanceExpectations
 * @returns { string key: value }
 */
ServiceDirective.prototype.getPerformanceExpectations = function() {
    return this._performanceExpectations;
};

/**
 * Retrieves specific configuration requirements peculiar to the service that must be set; crypto cyphers, db type, etc.
 *
 * @function plur/service/ServiceDirective.prototype.getServiceConfiguration
 * @returns { string key: value }
 */
ServiceDirective.prototype.getServiceConfiguration = function() {
    return this._serviceConfiguration;
};

return ServiceDirective;
});
