var mongoose = require('mongoose');
var Tops = mongoose.model('Tops');

exports.getTops = function()
{
	return Tops
		.find()
		.sort('-fecha')
		.limit(1);
}