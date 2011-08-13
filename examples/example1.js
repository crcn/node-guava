var client = require('guava').Client,
connection = client.connect();


var hello_c = connection.collection('hello');


//simple enough
hello_c.on({ name: 'craig' }, function(result)
{
	console.log(result)
});

hello_c.on({ name: 'tim' }, function(result)
{
	console.log(result)
});

hello_c.on({ name: { $in: ['craig', 'tim' ]}, age: { $gt: 20 }}, function(result)
{
	console.log(result)
});



hello_c.emit({ name: 'craig', age: 21 });
hello_c.emit({ name: 'tim', age: 20 });

