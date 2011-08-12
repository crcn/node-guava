Guava - Push for database
=========================

What are some cool stuff?
-------------------------

- Gives database "push", similar to twitter's realtime stream
- Saves hits to the database for realtime applications
- Supports mongodb statements: $all, $exists, $mod, $ne, $in, $nin, $nor, $or, $and, $size


```javascript

var Guava = require('guava/node');

//wrapper for the driver: Mongo
var gva = new Guava(new Guava.Mongo()),

//the messages collection
messages = gva.collection('messages');


//first find any items with the names: craig, or tim in it.
messages.find({ name: { $in: ['craig','tim'] } }, function(err, cursor)
{
	//first loop through the results
	cursor.each(function(err, item)
	{
		//code here...
	});

	//then *bind* to any additional inserts to the database. this is *not* similar to mongodb's trailing function
	cursor.bind(function(item)
	{
		
	});

});


//next, insert the first item, triggering the data binding.
messages.insert({ name: 'craig', message: 'hello world!'});

```