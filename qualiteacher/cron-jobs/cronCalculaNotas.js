var cron = require('node-cron');
var UniversidadesController = require('../controllers/UniversidadesController')

exports.lanzaScheduler = function()
{
	console.log("Lanzamos Scheduler!");

	/**
	 * Cron cada día a las 23:00
	 */
	var task = cron.schedule('0 0 23 * * *', function(){
		UniversidadesController.calculaNotas();
	});

	task.start();
}
