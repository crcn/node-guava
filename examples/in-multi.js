var Observer = require('guava').Observer;


var obs = new Observer();

obs.on({ feeds: {$in: ['a','b','c','d']}}, function(data)
{
	console.log(data);
});


obs.emit({feeds: ['a']});