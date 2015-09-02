/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 */
define(function() { // no indent

var QueryBuilder = function() { };
QueryBuilder.CLASSPATH = 'plur/db/request/find/QueryBuilder';

QueryBuilder.Query = function(sql, values) {
	this.sql = sql;
	this.values = values;
};

/**
 * @param PlurDbFindRequest request
 * @return PlurDbFindRequestQueryBuilder.Query
 */
QueryBuilder.build = function(request) {
	var selectSql = request.getColumns().join(', ');
	var fromSql = QueryBuilder.getTableForClasspath(request.getTargetClasspath());
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
}

QueryBuilder._buildCondition = function(condition, values) {
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
}

QueryBuilder.getTableForClasspath = function(classpath) {
	return classpath.replace(/\//g, '_').toLowerCase();
}
	
return QueryBuilder;
}); // no indent