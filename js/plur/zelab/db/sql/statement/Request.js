/**
 * @copyright 2015 Asimovian LLC
 * @license MIT https://github.com/asimovian/plur/blob/master/LICENSE.txt
 * @requires plur/PlurObject plur/db/message/DbRequest plur/obj/ObjParser
 */
define(['plur/PlurObject', 'plur/db/message/DbRequest', 'plur/obj/Parser'], function(PlurObject, DbRequest, ObjParser) {

/**
 * Represents a DB request for querying data.
 *
 * @constructor plur/db/message/FindRequest
 * @param namepath
 * @param columnNames
 * @param orderBy
 * @param limit
 */
var Find = function(namepath, columnNames, orderBy, limit) {
    this._targetNamepath = ( typeof(namepath) === 'undefined' ? null : namepath );
    this._columnNames = ( typeof(columnNames) === 'undefined' ? null : columnNames );
    this._orderBy = ( typeof(orderBy) === 'undefined' ? null : orderBy );
    this._limit = ( typeof(limit) === 'undefined' ? null : limit );
    this._rootCondition = null;
};

Find.prototype = PlurObject.create('plur/db/message/FindRequest', Find);

Find.OR = 'OR';
Find.AND = 'AND';
Find.EQUAL = '=';
Find.NOT_EQUAL = '!=';
Find.GREATER = '>';
Find.LESS = '<';

Find.parseObj = function(o) {
	var find = new Find(o.from, o.select, o.orderBy, o.limit);
	find._rootCondition = Find.Condition.parseObj(o.where);
console.log(find);
console.log(find._rootCondition._leafConditions);
	return find;
}

PlurObjParser.get().registerParser(Find.namepath, Find.parseObj);


Find.prototype.AND = Find.AND;
Find.prototype.OR = Find.OR;
Find.prototype.EQUAL = Find.EQUAL;
Find.prototype.NOT_EQUAL = Find.NOT_EQUAL;
Find.prototype.GREATER = Find.GREATER;
Find.prototype.LESS = Find.LESS;

Find.prototype.select = function(columnNames) {
    this._columnNames = columnNames;
    return this;
};

Find.prototype.getColumns = function() {
    return this._columnNames;
};

Find.prototype.from = function(namepath) {
    this._targetNamepath = namepath;
    return this;
};

Find.prototype.getTargetNamepath = function() {
    return this._targetNamepath;
};

Find.prototype.where = function(conditionOrColumn, op, value) {
    this._rootCondition = ( typeof(op) === 'undefined' ? conditionOrColumn : new Find.Condition(conditionOrColumn, op, value) );
    this._rootCondition._request = this;
    return this._rootCondition;
};

Find.prototype.getRootCondition = function() {
    return this._rootCondition;
};

Find.prototype.limit = function(num) {
    this._limit = num;
    return this;
};

Find.prototype.getLimit = function() {
    return this._limit;
};

Find.prototype.orderBy = function(orderBy) {
    this._orderBy = orderBy;
    return this;
};

Find.prototype.getOrder = function() {
	return this._orderBy;
}

Find.prototype.toObj = function() {
    var o = {
        namepath: Find.namepath,
        from: this._targetNamepath
    };

    if (this._columnNames != null) {
        o.select = this._columnNames;
    }
    if (this._rootCondition) {
        o.where = this._rootCondition.toObj();
    }
    if (this._orderBy != null) {
        o.orderBy = this._orderBy;
    }
    if (this._limit != null) {
       o.limit = this._limit;
    }

    return o;
}

Find.Condition = function(column, op, value) {
    this._column = column;
    this._op = op;
    this._value = value;
    this._leafConditions = []
    this._logicOp = null;
};

Find.Condition.parseObj = function(o) {
	var c = new Find.Condition(o.column, o.op, o.value);
	if (typeof(o.logicOp) !== 'undefined') {
		c._logicOp = o.logicOp;
	}
	
	if (typeof(o.conditions) !== 'undefined') {
		for (var i = 0; i < o.conditions.length; ++i) {
			c._leafConditions.push(Find.Condition.parseObj(o.conditions[i]));
		}
	}

	return c;
};

Find.Condition.prototype = {
	getLeafConditions: function() {
		return this._leafConditions;
	},

	getLogicOperator: function() {
		return this._logicOp;
	},
	
	getColumn: function() {
		return this._column;
	},
	
	getOperator: function() {
		return this._op;
	},
	
	getValue: function() {
		return this._value;
	},	
	
	and: function(conditionOrColumn, op, value) {
        var condition = ( typeof(op) === 'undefined' ? conditionOrColumn : new Find.Condition(conditionOrColumn, op, value) );
        condition._request = this._request;
        condition._logicOp = Find.AND;
	    this._leafConditions.push(condition);	
        return this;
	},

	or: function(conditionOrColumn, op, value) {
        var condition = ( typeof(op) === 'undefined' ? conditionOrColumn : new Find.Condition(conditionOrColumn, op, value) );
        condition._request = this._request;
        condition._logicOp = Find.OR;
	    this._leafConditions.push(condition);	
        return this;
	},
    
    orderBy: function(statements) {
        return this._request.orderBy(statements);
    },

    limit: function(num) {
        return this._request.limit(num);
    },

    toObj: function() {
        var o = {
            column: this._column,
            op: this._op,
            value: this._value
        };

        if (this._logicOp !== null) {
        	o.logicOp = this._logicOp;
        }
        
        if (this._leafConditions.length > 0) {
            o.conditions = [];
            for (var i = 0; i < this._leafConditions.length; ++i) {
                o.conditions.push(this._leafConditions[i].toObj());
            }
        }

        return o;
    }
};

return Find;
});
