
require.paths.unshift(__dirname + '/../vendors');


var core = require('../core'),
Client = require('./client');

exports.Observer = core.Observer;
exports.Client = Client;