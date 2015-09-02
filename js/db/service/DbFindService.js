/**
 * PlurDbFindService <plur/db/service/Find>
 * Responds to PlurDbRequestFind requests with PlurDbFindResponse responses.
 * Requesting client must have ACL rights for table/row queried.
 * @copyright 2013 binaryCult
 * @license https://github.com/binarycult/plur/blob/master/LICENSE.txt
 * @author Roy Laurie <roy.laurie@gmail.com>
 */
define(['pg', 'plur/service/Service', 'plur/db/response/Find', 'plur/db/request/find/QueryBuilder', 'plur/db/request/Find'], function(pg, PlurService, PlurDbFindResponse, QueryBuilder, PlurDbFindRequest) { // no indent

var Find = function() {
	
};

Find.CLASSPATH = 'plur/db/service/Find';
Find.REQUEST_CLASSPATHS = ['plur/db/request/Find'];

Find.prototype = new PlurService();
Find.prototype.constructor = Find;
Find.prototype.CLASSPATH = Find.CLASSPATH;

/**
 * @param PlurDbRequestFind request
 */
Find.prototype.process = function(request, response, callback) {
	if (typeof(response) === 'function') {
		callback = response;
		response = null;
	}
	
	var query = QueryBuilder.build(request);
	console.log('query', query);
	var uri = 'tcp://rlaurie:password@localhost/plurtest';
	var response = null;

	var db = new pg.Client(uri);
	db.connect(function(err) {
		console.log("connect err ", err);
		db.query(query.sql, query.values, function(err, result) {
			console.log("query ", err, result);
			response = new PlurDbFindResponse(result.rows, request.getColumns());
			db.end();
			callback(response);
		});
	});
};

Find.prototype.getRequestClasspathes = function() {
	return Find.REQUEST_CLASSPATHES;
}
	
return Find;
}); // no indent