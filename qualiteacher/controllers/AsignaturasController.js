var mongoose = require('mongoose');
var Asignaturas = mongoose.model('Asignaturas');
var ProfesoresController = require('./ProfesoresController.js')
var UtilsController = require('./UtilsController.js')

/**
 * Devolver todas las asignaturas
 */
exports.findAll = function(req, res) {
	Asignaturas
		.find()
		.exec(function(err, profesor) {
		if(err) res.send(500, err.message);

		console.log('GET /Asignaturas')
		res.status(200).jsonp(profesor);
	});
};

/**
 * Devuelve una asignatura por id
 */
exports.detalleAsignatura = function (req, res) {
	Asignaturas.findOne({'_id': req.params.asignatura})
		.populate('universidad')
		.populate('carrera')
		.populate('profesores')
		.exec(function(err, asignatura){

			if (err) console.log(err);

			if (asignatura === null)
			{
				res.status(400).send({"error": "Esa asignatura no existe"})
			}
			else
			{
				Asignaturas.populate(asignatura, {path: 'profesores.votos', model: 'Votos'}, function (err, asignatura) {

					var profesores_con_nota = [];

					for (var i = 0; i < asignatura.profesores.length; i++)
					{
						profesores_con_nota.push(ProfesoresController.generaProfesorConNotaAsignatura(asignatura.profesores[i], asignatura._id));
					}

					var asignatura_para_vista = {
						_id : asignatura._id,
						nombre: asignatura.nombre,
						codigo: asignatura.codigo,
						universidad: asignatura.universidad,
						carrera: asignatura.carrera,
						profesores: profesores_con_nota
					}
					console.log(JSON.stringify(asignatura_para_vista));
					res.render('asignatura', {title: ('Qualiteacher | '+asignatura.nombre), asignatura: asignatura_para_vista})
				})
			}
		});
};

exports.actualizarNotasAsignatura = function (id_asignatura, calificacion)
{
	Asignaturas.findOne()
		.where('_id')
		.equal(id_asignatura)
		.exec(function (err, asignatura) {
			if (asignatura.num_notas_pp === null || asignatura.num_notas_pp === undefined) {
				asignatura.num_notas_pp = UtilsController.generaMatrizRecuentoNotasPorPregunta();
				asignatura.num_votos = 0;
			}

			UtilsController.sumaVotoANumNotasPP(asignatura.num_notas_pp, asignatura.num_votos, calificacion);
			asignatura.nota = UtilsController.recalculaNota(asignatura.num_notas_pp, asignatura.num_votos)

			asignatura
				.save(function (err, next) {
					if (err) {
						console.log(err);
						return next(err);
					}

					console.log("Asignatura v actualizada")
					console.log(asignatura)
				});
		});
};