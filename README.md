Guava - Push for database
=========================

What are some cool stuff?
-------------------------

- supports most statements by mongodb
- 

```javascript

var Guava = require('guava/node');


var gva = new Guava(new Guava.Mongo()),
messages = gva.collection('messages');

messages.find({ name: { $in: ['craig','tim'] } }, function(err, cursor)
{
	//binds to any additions
	cursor.bind(function(item)
	{
		
	});

	cursor.each(function(err, item)
	{
		//do whatever you want here...
	});
});


//triggers the binding
messages.insert({ name: 'craig', message: 'hello world!'});

```