Guava - EventEmitter for database queries
=========================================

- Listen to any query for inserts before they're sent to the database
- Saves hits to the database for realtime applications
- Modeled after mondodb, and supports: $all, $exists, $mod, $ne, $in, $nin, $nor, $or, $and, $size

Real world examples:
-------------------

- Twitter realtime stream

Server Example:
---------------

In Terminal:

	guava


In javascript file:
	
```javascript

var Client = require('guava').Client,
People = Client.connect().collection('people');

People.on({ name: { $in: ['craig','tim','jake'], age: { $gt : 16 } } }, function(person)
{
	
	//craig is a 9001 year old male
	console.log('%s is a %d year old %s', person.name, person.gender, person.age);
});

//gets caught
People.emit({ name: 'craig', gender: 'male', age: 9001 });

//doesn't get caught
People.emit({ name: 'jake', gender: 'female', age: 14 }); 

```


In-App Example:
---------------
	
```javascript

var Observer = require('guava').Observer;

var messages = new Observer(),
nowMS = new Date().getTime();

messages.on({ name: { $in: ['craig','tim'] }, createdAt: { $gt: new Date(), $lt: new Date(nowMS + 20000)} }, function(item)
{
	console.log(item.message);//hello world!

});

messages.emit({ name: 'craig', message: 'hello world!', createdAt: new Date(nowMS + 10000)});

```