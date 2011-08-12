var Structr = require('structr');


var Driver = module.exports = Structr({
	
	/**
	 */

	'__construct': function(config)
	{
		
	},

	/**
	 */

	'collection': function(name)
	{
		return this._collections[name] || (this._collections[name] = new Collection(name, this));
	}
})