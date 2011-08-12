var stmt = require('./stmt');


var Observer = function()
{

	var listeners = [];

	/**
	 * listens for change
	 */


	this.on = function(statement, callback)
	{


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
			score:0,

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
	}

	/**
	 * emits data change
	 */

	this.emit = function(data)
	{
		var index = listeners.length,

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

			process.nextTick(function()
			{
				cursor.next(nextListener);
			});
		}

		cursor.next(nextListener);
	}




	// function matchesValue()
}

var obs = new Observer();

obs.on({ name: 'craig', $and: [ { last: 'condon' }, { middle: 'jefferds'} ] }, function(data)
{
	console.log(data)
});



//data changed
obs.emit({ name: 'craig', age: 21, last:'condon', middle: 'jefferds', friend: 'joe' });