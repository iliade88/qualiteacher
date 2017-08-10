var cron = require('node-cron');
var mongoose = require('mongoose');
var Universidades = mongoose.model('Universidades');
var Carreras = mongoose.model('Carreras');
var Asignaturas = mongoose.model('Asignaturas');
var Profesores = mongoose.model('Profesores');
var Tops = mongoose.model('Tops');

exports.lanzaScheduler = function()
{
	console.log("Lanzamos Scheduler!");

	/**
	 * Cron cada día a las 00:00
	 */
	var task = cron.schedule('0 0 0 * * *', function(){

		//En principio será top 5
			var top_universidades = [];
			var top_carreras = [];
			var top_asignaturas = [];
			var top_profesores = [];

			Universidades
				.find()
				.select('_id nombre nota')
				.sort({'nota': 'desc'})
				.limit(5)
				.exec(function (err, universidades) {
					if(err) console.log(err);

					console.log("Fin top universidades")
					top_universidades = universidades;

					Carreras
						.find()
						.select('_id nombre nota universidad')
						.populate({
							path: 'universidad',
							select: 'nombre'
						})
						.limit(5)
						.sort({'nota': 'desc'})
						.exec(function (err, carreras) {
							if(err) res.send(500, err.message);

							console.log("Fin top carreras")
							top_carreras = carreras;

							Asignaturas
								.find()
								.select('_id nombre nota universidad carrera')
								.populate({
									path: 'carrera',
									select: 'nombre'
								})
								.populate({
									path: 'universidad',
									select: 'nombre'
								})
								.limit(5)
								.sort({'nota': 'desc'})
								.exec(function (err, asignaturas) {
									if(err) res.send(500, err.message);

									console.log("Fin top asignaturas")
									top_asignaturas = asignaturas;

									Profesores
										.find()
										.select('_id nombre nota universidad asignatura')
										.populate({
											path: 'asignatura',
											select: 'nombre carrera',
											populate : {
												path: 'carrera',
												select: 'nombre'
											}
										})
										.populate({
											path: 'universidad',
											select: 'nombre'
										})
										.limit(5)
										.sort({'nota': 'desc'})
										.exec(function (err, profesores) {
											if(err) res.send(500, err.message);

											console.log("Fin top profesores")
											top_profesores = profesores;

											var top = new Tops({
												universidades : top_universidades,
												carreras : top_carreras,
												asignaturas : top_asignaturas,
												profesores : top_profesores
											});

											top.save();
										});
								});
						});
				});
	});

	task.start();
};
