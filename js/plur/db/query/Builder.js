/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject
 */
define([
	'plur/PlurObject' ],
function(
	PlurObject ) {

/**
 * Creates a SQL queries for DB Find Requests conditions.
 *
 * @constructor plur/db/message/FindRequestQueryBuilder
 */
var QueryBuilder = function() {
};

QueryBuilder.Query = function(sql, values) {
	this.sql = sql;
	this.values = values;
};

QueryBuilder.prototype = PlurObject.create('plur/db/message/FindRequestQueryBuilder', QueryBuilder);

/**
 * Determines the DB table name for the given namepath.
 *
 * @function plur/db/message/FindRequestQueryBuilder.prototype.getTableForNamepath.
 * @param string namepath
 * @returns string
 */
QueryBuilder.getTableForNamepath = function(namepath) {
	return namepath.replace('/\//', '_').toLowerCase();
};

/**
 * Creates a SQL query for the provided DB Find Request.
 *
 * @function plur/db/message/FindRequestQueryBuilder.prototype.build
 * @param PlurDbFindRequest request
 * @returns PlurDbFindRequestQueryBuilder.Query
 */
QueryBuilder.prototype.build = function(request) {
	var selectSql = request.getColumns().join(', ');
	var fromSql = QueryBuilder.getTableForNamepath(request.getTargetNamepath());
	var orderSql = request.getOrder().join(', ');
	var limitSql = request.getLimit();
	var values = [];
	var whereSql = QueryBuilder._buildCondition(request.getRootCondition(), values);
	var sql = 'SELECT ' + selectSql
	+ ' FROM ' + fromSql
	+ ' WHERE ' + whereSql
	+ ' ORDER BY ' + orderSql
	+ ' LIMIT ' + limitSql;
	return new QueryBuilder.Query(sql, values);
};

/**
 * Builds SQL queries for a condition and any of its components.
 *
 * @function plur/db/message/FindRequestQueryBuilder.prototype.build
 * @param plur/db/message/FindRequest.Condition condition
 * @param string[] values
 * @returns string
 */
QueryBuilder.prototype._buildCondition = function(condition, values) {
	var v = values.length + 1;
	var sql = '';

	var isRoot = ( condition.getLogicOperator() === null );
	if (!isRoot) {
		sql += ' ' + condition.getLogicOperator() + ' ';
	}
	
	var nested = ( condition.getLeafConditions().length > 0 );
	if (nested && !isRoot) {
		sql += ' ( ';
	}
	
	sql += condition.getColumn() + ' ' + condition.getOperator() + ' $' + v++;
	values.push(condition.getValue());
	var leaves = condition.getLeafConditions();
	for (var l = 0; l < leaves.length; ++l) {
		var leaf = leaves[l];
		sql += QueryBuilder._buildCondition(leaf, values);
	}
	
	if (nested && !isRoot) {
		sql += ' )';
	}
	
	return sql;
};

/**
 * @var plur/db/message/FindQueryQueryBuilder plur/db/message/FindRequestQueryBuilder.singleton
 */
QueryBuilder.singleton = new QueryBuilder();
	
return QueryBuilder.singleton;
});