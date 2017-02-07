/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires pg plur/PlurObject plur/service/Service plur/db/response/Find plur/db/request/find/QueryBuilder
 */
define([
    'pg',
    'plur/PlurObject',
    'plur/service/Service',
    'plur/log/Log',
    'plur/db/response/Find',
    'plur/db/request/find/QueryBuilder',
    'plur/db/request/Find' ],
function(
    pg,
    PlurObject,
    Service,
    Log,
    DbFindResponse,
    QueryBuilder,
    DbFindRequest ) {

/**
 * Provides a DB Service for querying.
 *
 * @constructor plur/db/service/DbFindService
 * @extends plur/service/Service
 * @param {} connectionParams
 */
var DbFindService = function(connectionParams) {
	this._uri = 'tcp://rlaurie:password@localhost/plur-tests'; //todo: connection parameters built on construction
};

DbFindService.prototype = PlurObject.create('plur/db/service/DbFindService', DbFindService, Service);

DbFindService._requestNamepaths = ['plur/db/request/Find'];

/**
 * Processes a DB query request, returning the response to a specified callback.
 *
 * @function plur/db/service/DbFindService.prototype.process
 * @param plur/db/message/PlurDbRequestFind request
 * @param plur/db/message/DbFindResponse response
 * @param function(plur/db/message/DbFindResponse response) callback
 */
Find.prototype.process = function(request, response, callback) {
	if (typeof response === 'function') {
		callback = response;
		response = null;
	}

	var query = QueryBuilder.build(request);
	Log.debug(this.namepath + '.process Query: ', query);
	var db = new pg.Client(this._uri);

	db.connect(function(err) {
		Debug.error(this.namepath + '.prototype.process', err);
		db.query(query.sql, query.values, function(err, result) {
		    Log.debug(this.namepath + '.prototype.process', { result: result, err: err });
			var response = new PlurDbFindResponse(result.rows, request.getColumns());
			db.end();
			callback(response);
		});
	});
};

/**
 * Retrieves the request namepaths that this service handles.
 *
 * @function plur/db/service/DbFindService
 * @returns string[]
 */
Find.prototype.getRequestNamepathes = function() {
	return Find._requestNamepaths;
};
	
return Find;
});