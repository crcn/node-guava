Guava - Query listener for database drivers
==========================================

- Listen to any query for inserts before they're sent to the database
- Saves hits to the database for realtime applications
- Supports mongodb statements: $all, $exists, $mod, $ne, $in, $nin, $nor, $or, $and, $size

Real world examples:
-------------------

- Twitter realtime stream

Example:
--------

```javascript

var guava = require('guava/node');

var obs = new new guava.Observer();

obs.on({ name: { $in: ['craig','tim'] } }, function(item)
{
	console.log(item.message);//hello world!

});

obs.emit({ name: 'craig', message: 'hello world!'});

```