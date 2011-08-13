var client = require('guava').Client,
connection = client.connect();


var hello_c = connection.collection('hello');



hello_c.emit({ name: 'craig', age: 21 });
hello_c.emit({ name: 'tim', age: 20 });

