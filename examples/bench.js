var Observer = require('guava').Observer;

var obs = new Observer();


var start = new Date();


//some heavier stuff...
for(var i = 100; i--;)
obs.on({ $or: [ {tags: { $all: ['this','is','another','test']}}, {tags: { $all: ['this','is','another','test','again'] }}] , count: { $lt: 1000 }}, function(item)
{
	// console.log(item.count)
});


//100,000,000 

for(var i = 100000; i--;)
{
	obs.emit({tags:['this','is','another','test','again'], count: i })
}

console.log(new Date().getTime() - start.getTime());