var Structr = require('structr');


var Guava = Structr({
	
	/**
	 */

	'__construct': function(driver)
	{
		
	},

	/**
	 */

	'collection': function()
	{
		return this._collections[name] || (this._collections[name] = new Collection(name, this));
	}
})