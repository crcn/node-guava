var Observer = require('../lib/node/observer');


var obs = new Observer();

obs.on({ name: 'craig', age: { $ne : 20 } }, function(data)
{
	console.log(data)
});

obs.emit({ name: 'craig' });
obs.emit({ name: 'craig', age: 20 });
obs.emit({ name: 'craig', age: 21 });



obs.on({ title: 'hello', message: 'world', createdAt: { $gt: new Date(new Date().getTime() - 100 ) }}, function(data)
{
	console.log(data);
})


obs.emit({ title: 'hello', message: 'world', createdAt: new Date() });