var stmt = require('./stmt'),
Structr = require('structr');


var Observer = Structr({
	
	/**
	 */

	'__construct': function()
	{
		this._listeners = [];
	}

	/**
	 */

	'on': function(statement, callback)
	{
		var listeners = this._listeners;


		var listener = {

			/**
			 * the statement to match against
			 */

			stmt: stmt.parse(statement),

			/**
			 * the callback listener
			 */

			callback: callback,

			/**
			 * score used to sort listeners based on how often they're used
			 */
			score: 0,

			/**
			 * disposes the listener
			 */

			dispose: function()
			{
				var i = listeners.indexOf(listener);

				if(i > -1)
				{
					listeners.splice(i, 1);
					return true;
				}

				return false;
			}
		};

		listeners.push(listener);

		return listener;
	},

	/**
	 */

	'emit': function(data)
	{
		var listeners = this._listeners,
		index = listeners.length,
		self = this,

		//use a cursor so we can by asynchronous with the emits
		cursor = { 
			next: function(callback)
			{
				for(; index--;)
				{
					if(stmt.test(listeners[index].stmt, data))
					{
						listeners[index].score++;

						return callback(listeners[index], data);
					}	
				}

				return callback(null);
			}
		},

		nextListener = function(listener, data)
		{
			if(!listener) return;

			listener.callback(data);

			self.nextTick(function()
			{
				cursor.next(nextListener);
			});
		}

		cursor.next(nextListener);
	},

	/**
	 */
	
	nextTick: function(callback)
	{
		setTimeout(callback, 0);
	}
});
