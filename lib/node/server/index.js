var Observer = require('../index').Observer,
dnode = require('dnode');


function start()
{

	var collections = {};



	function collection(name)
	{
		return collections[name] || (collections[name] = new Observer());
	}

	var server = dnode(function(client, conn)
	{

		var disposables = [];
		
		this.on = function(collectionName, query, callback)
		{
			disposables.push(collection(collectionName).on(query, callback));
		}


		this.emit = function(collectionName, data)
		{
			collection(collectionName).emit(data);
		}

		conn.on('end', function()
		{
			for(var i = disposables.length; i--;)
			{
				disposables[i].dispose();
			}

			disposables = [];
		})
	}).listen(5050);
}

exports.start = start;