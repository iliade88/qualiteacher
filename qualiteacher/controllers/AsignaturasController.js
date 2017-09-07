var mongoose = require('mongoose');
var Asignaturas = mongoose.model('Asignaturas');
var UtilsController = require('./UtilsController.js')

/**
 * Devuelve una asignatura por id
 */
exports.detalleAsignatura = function (req, res, next) {
	Asignaturas.findOne({'_id': req.params.asignatura})
		.populate('universidad')
		.populate('carrera')
		.populate('profesores')
		.exec(function(err, asignatura){

			if (err) res.send(500, err.message);

			if (asignatura === null)
			{
				var err = new Error("Esa asignatura no existe");
				err.status = 404;
				next(err);
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
					if (err) return next(err);

					Asignaturas.findByIdAndUpdate(asignatura._id, {$set: {'num_notas_pp': asignatura.num_notas_pp}}, function(err, doc) {
						console.log(doc);
					});
				});
		});
};