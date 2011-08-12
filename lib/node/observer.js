var Observer = require('../core/observer');

module.exports = Observer.extend({
	
	/**
	 */

	'nextTick': function(callback)
	{
		process.nextTick(callback);
	}
})