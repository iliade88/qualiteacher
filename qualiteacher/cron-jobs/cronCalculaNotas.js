var cron = require('node-cron');
var UniversidadesController = require('../controllers/UniversidadesController')

exports.lanzaScheduler = function()
{
	console.log("Lanzamos Scheduler!");

	/**
	 * Cron cada día a las 23:00
	 */
	/*var task = cron.schedule('0 0 23 * * *', function(){

		var top = new Tops({
			universidades : UniversidadesController.GetTopN(numero),
			carreras : CarrerasController.GetTopN(numero),
			asignaturas : AsignaturasController.GetTopN(numero),
			profesores : ProfesoresController.GetTopN(numero)
		});

		top.save(function(err) { if (err) console.log(err); });
	});

	task.start();*/
}
