var Observer = require('../index').Observer,
dnode = require('dnode');

function deserializeRegex(target)
{
	for(var k in target)
	{
		var v = target[k];

		if(k == '$regexp')
		{
			return new RegExp(v.source, v.flags);
		}
		else
		if(typeof v == 'object')
		{
			target[k] = deserializeRegex(v);
		}
	}
	return target;
}


function start()
{

	var collections = {};

	function collection(name)
	{
		return collections[name] || (collections[name] = new Observer());
	}

	var server = dnode(function(client, conn)
	{
		console.log('client connected: %s'.magenta, conn.id);

		var disposables = {};
		
		this.on = function(collectionName, op, callback)
		{
			console.log('client %s listening to query on %s'.magenta, conn.id, collectionName);

			disposables[collectionName+op.id] = collection(collectionName).on(deserializeRegex(op.query), callback);
		}

		this.dispose = function(collectionName, id)
		{
			console.log('client %s disposing listener %s on %s'.grey, conn.id, id, collectionName);

			var uid = collectionName+id;

			var disposable = disposables[id];
			if(disposable) disposable.dispose();
			delete disposables[id];
		}

		this.emit = function(collectionName, data, ops)
		{
			console.log(collectionName);

			console.log('emit data on %s'.grey, collectionName);

			var ar = data instanceof Array ? data : [];

			for(var i = ar.length; i--;)
			{
				collection(collectionName).emit(ar[i], ops);
			}
		}

		conn.on('end', function()
		{
			for(var id in disposables)
			{
				disposables[id].dispose();
			}

			disposables = {};
		})
	}).listen(5050);
}

exports.start = start;