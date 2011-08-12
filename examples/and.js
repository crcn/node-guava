var guava = require('../lib/node');


var gva = new guava.Mongo('mongodb://minimacblack.local/test.database'),
messages = gva.collection('messages');


messages.find({ name: 'craig' }, function(err, cursor)
{
	// console.log(cursor.populate)
	// console.log(cursor.bind)
});

messages.insert({ name: 'craig' },function(){});