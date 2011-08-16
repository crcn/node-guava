var client = require('guava').Client,
connection = client.connect();


var hello_c = connection.collection('hello');


//simple enough
var disp = hello_c.on({ name: /\w+/ }, function(result)
{
	disp.dispose();
	console.log(result)
});

hello_c.on({ name: 'tim' }, function(result)
{
	console.log(result)
});

/*hello_c.on({ name: { $in: ['craig', 'tim' ]}, age: { $gt: 20 }}, function(result)
{
	console.log(result)
});*/


