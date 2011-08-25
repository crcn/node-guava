var guava = require('../index').Observer,
dnode = require('dnode'),
Structr = require('structr'),
Queue = require('sk/core/queue').Queue;


function serializeRegex(target)
{
	for(var k in target)
	{
		var v = target[k],
		tov = typeof v;

		if(tov == 'object')
		{
			serializeRegex(v);
		}
		else
		if(tov == 'function' && v.source)
		{
			var regex = v.toString(),
			source = v.source,
			flags = regex.match(/\/(\w*)$/)[1];

			target[k] = { $regexp: { source: source, flags: flags } };
		}
	}

	return target;
}

/*RegExp.prototype.toJSON = function()
{
	var regex = this.toString(),
	source = this.source,
	flags = regex.match(/\/(\w+)$/)[1];

	return { source: source, flags: flags };
}*/

var Collection = Structr({
	
	/**
	 */

	'__construct': function(name, client)
	{
		this._name = name;
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
			self.client.remote.on(self._name, { id: index, query: serializeRegex(Structr.copy(query))} , onResponse);
			self.client._q.next();
		})

		return {
			dispose: function()
			{
				disposed = true;

				//tell the server to stop watching
				self.client.remote.dispose(self._name, index);
			}
		}
	},

	/**
	 */

	'emit': function(data, ops)
	{
		var self = this;

		//dnode doesn't like items it cannot serialize ~ it doesn't even *use* JSON.stringify
		if(data && (data.constructor != Object && data.constructor != Array))
		{
			data = JSON.parse(JSON.stringify(data));
		}

		self.client._q.add(function()
		{
			//serialization only happens for queries
			self.client.remote.emit(self._name, data, ops);
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
