exports.Observer = require('./observer');
exports.stmt = require('./stmt');


exports.statement = function(query)
{
    return exports.stmt.parse(query);
}
