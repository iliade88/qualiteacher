var cron = require('node-cron');

exports.lanzaScheduler = function()
{
	console.log("Lanzamos Scheduler!");

	var task = cron.schedule('0 0 23 * * *', function(){
		console.log("SOY CRON!")
	});

	task.start();
}
