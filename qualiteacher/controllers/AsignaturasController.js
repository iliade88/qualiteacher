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

			if (err) res.send(500, err.message);

			if (asignatura === null)
			{
				res.status(400).send({error: "Esa asignatura no existe"})
			}
			else
			{
				res.render('asignatura', {title: ('Qualiteacher | '+asignatura.nombre), asignatura: asignatura})
			}
		});
};

exports.actualizarNotasAsignatura = function (id_asignatura, calificacion)
{
	Asignaturas.findOne({'_id': id_asignatura})
		.exec(function (err, asignatura) {
			if (asignatura.num_notas_pp === null || asignatura.num_notas_pp === undefined) {
				asignatura.num_notas_pp = UtilsController.generaMatrizRecuentoNotasPorPregunta();
				asignatura.num_votos = 0;
			}

			UtilsController.sumaVotoANumNotasPP(asignatura, calificacion);
			asignatura.nota = UtilsController.recalculaNota(asignatura.num_notas_pp, asignatura.num_votos)

			asignatura
				.save(function (err, next) {
					if (err) {
						return next(err);
					}
				});
		});
};