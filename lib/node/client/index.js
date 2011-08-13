var guava = require('../index').Observer,
dnode = require('dnode'),
Structr = require('structr'),
Queue = require('sk/core/queue').Queue;




var Collection = Structr({
	
	/**
	 */

	'__construct': function(name, client)
	{
		this.name = name;
		this.client = client;
		this._listeners = 0;
	},

	/**
	 */

	'on': function(query, callback)
	{
		var self = this,
		index = self._listeners++,
		disposed = false;

		//sync calls don't get blocked
		var onResponse = function()
		{
			if(disposed) return;

			callback.apply(null, arguments);
		}

		self.client._q.add(function()
		{
			self.client.remote.on(self.name, { id: index, query: query} , onResponse);
			self.client._q.next();
		})

		return {
			dispose: function()
			{
				disposed = true;

				//tell the server to stop watching
				self.client.remote.dispose(self.name, index);
			}
		}
	},

	/**
	 */

	'emit': function(data)
	{
		var self = this;

		self.client._q.add(function()
		{
			self.client.remote.emit(self.name, data);
			self.client._q.next();
		});
	}
})

var Client = Structr({
	
	/**
	 */

	'__construct': function()
	{
		this._q = new Queue(true);
		this._q.add(function(){});
	},

	/**
	 */

	'connect': function(host, port)
	{
		var self = this;


		dnode.connect(port, function(remote)
		{
			self.remote = remote;
			self._q.next();	
		})	
	},

	/**
	 */

	'collection': function(name)
	{
		return new Collection(name, this);
	}
});



exports.connect = function(port)
{
	if(exports.client) return exports.client;
	var client = exports.client = new Client();
	client.connect('localhost',port || 5050);

	return client;
}

exports.collection = function(name)
{
	return exports.connect().collection(name);
}
