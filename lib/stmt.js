module.exports = new (function()
{

	/**
	 * tests against data
	 */
	 
	var test = this.test = function(statement, data)
	{
		for(var i = statement.length; i--;)
		{
			var expr = statement[i];

			if(!expr.e(expr.v, data[expr.k], data)) return false;
		}

		return true;
	}


	/**
	 * parses a statement into something evaluable
	 */

	var parse = this.parse = function(statement)
	{
		return builder.parse(statement).stmt;
	}

	var WEIGHT_FACTOR = {
		$eq: 1,
		$ne: 2,
		$exists: 2,
		$lt: 2,
		$gt: 2,
		$size: 3,
		// $type: 4,
		$in: 4,
		$nin: 4,
		$all: 5,
		$or: 6,
		$nor: 6,
		$and: 7
	};


	var weigh = {

		boolean: function(value)
		{
			return 0;
		},
		
		string: function(value)
		{
			return value.length;
		},

		number: function(value)
		{
			return value;
		},

		object: function(value)
		{
			if(value instanceof Array)
			{
				return weigh.array(value);
			}
			else
			{
				return weigh.complex(value);
			}
		},

		array: function(value)
		{
			var total = 0;

			for(var i = value.length; i--;)
			{
				total += weight(value[i]);
			}

			return total;
		},

		complex: function(value)
		{
			return value;
		}
	};


	function weight(value)
	{
		return weigh[typeof value](value);
	}


	var testers = {
		
		/**
		 */

		$eq: function(a, b)
		{
			return a == b;
		},

		/**
		 */

		$ne: function(a, b)
		{
			return a != b;
		},

		/**
		 */

		$lt: function(a, b)
		{
			return a > b;
		},

		/**
		 */

		$gt: function(a, b)
		{
			return a < b;
		},

		/**
		 */

		$lte: function(a, b)
		{
			return a >= b;
		},

		/**
		 */

		$gte: function(a, b)
		{
			return a <= b;
		},


		/**
		 */

		$exists: function(a, b)
		{
			return a == !!b;
		},

		/**
		 */

		$in: function(a, b)
		{
			if(typeof b == 'array')
			{
				for(var i = b.length; i--;)
				{
					if(a.indexOf(b[i]) > -1) return true;
				}	
			}
			else
			{
				return a.indexOf(b) > -1;
			}
		},

		/**
		 */

		
		$nin: function(a, b)
		{
			return !testers.$in(a, b);
			// return a.indexOf(b) == -1;
		},

		/**
		 */

		$mod: function(a, b)
		{
			return b % a[0] == a[1];
		},

		/**
		 */

		$all: function(a, b)
		{
			for(var i = a.length; i--;)
			{
				var v = a[i];

				if(b.indexOf(v) == -1) return false;
			}

			return true;
		},

		/**
		 */

		$size: function(a, b)
		{
			return a.length == b.length;
		},

		/**
		 */

		$or: function(a, b, data)
		{
			for(var i = a.length; i--;)
			{
				if(test(a[i].stmt, data))
				{
					return true;
				}
			}

			return false;
		},

		/**
		 */

		$and: function(a, b, data)
		{
			for(var i = a.length; i--;)
			{
				if(!test(a[i].stmt, data))
				{
					return false;
				}
			}

			return true;
		}
	}


	var getExpr = function(type, key, value)
	{
		//w weight
		//t type
		//k key
		//v value
		//e eval
		return { w: WEIGHT_FACTOR[type] * 100 + weight(value), 
			t: type,
			k: key, 
			v: value, 
			e: testers[type] };
	}

	var orderStmt = function(stmt)
	{
		stmt.sort(function(a, b)
		{
			return a.w < b.w;
		})

		return stmt;
	}

	var builder = {

		/**
		 */

		parse: function(statement)
		{

			var ordered = [], expr;

			for(var key in statement)
			{
				var expr = (key.substr(0, 1) == '$' ? builder.group : builder.single)(key, statement[key]);

				if(expr instanceof Array)
				{
					ordered = ordered.concat(expr);
				}
				else
				{
					ordered.push(expr);
				}
			}

			var weight = 0;

			for(var i = ordered.length; i--;)
			{
				weight += ordered[i].w;	
			}

			return { stmt: orderStmt(ordered), w: weight };
		},


		/**
		 */

		group: function(key, value)
		{
			var stmts = [];

			for(var i = value.length; i--;)
			{
				stmts.push(builder.parse(value[i]));
			}

			return getExpr(key, key, orderStmt(stmts));
		},

		/**
		 */

		single: function(key, value)
		{
			return typeof value == 'object' ? builder.complex(key, value): getExpr('$eq', key, value);
		},

		/**
		 */

		complex: function(key, value)
		{
			var testers = [];

			for(var k in value)
			{
				if(k.substr(0,1) == '$')
				{
					var fact = WEIGHT_FACTOR[k];

					if(fact) testers.push(getExpr(k, key, value[k]));
				}
			}	

			return testers;
		}
	}

})();