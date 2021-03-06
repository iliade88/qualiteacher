var mongoose = require('mongoose');
var Carreras = mongoose.model('Carreras');
var Asignaturas = mongoose.model('Asignaturas');

/**
 * Devolver todas las carreras
 */
exports.findAll = function(req, res) {
	Carreras
		.find()
		.exec(function(err, carreras) {
			if(err) res.send(500, err.message);

			if (carreras === null)
			{
				res.status(404).send({error: "La carrera no existe"})
			}
			res.status(200).jsonp(carreras);
		});
};

/**
 * Recupera los datos de la carrera por id y los muestra en la vista de detalle
 */
exports.detalleCarrera = function (req, res, next) {
	Carreras.findOne({'_id': req.params.carrera})
		.populate('universidad')
		.populate('asignaturas')
		.exec(function(err, carrera){

			if (err) res.send(500, err.message);

			if (carrera === null)
			{
				var err = new Error("Esa carrera no existe");
				err.status = 404;
				next(err);
			}
			else
			{
				res.render('carrera', {title: ('Qualiteacher | '+carrera.nombre), carrera: carrera})
			}
		});
}

/**
 * Devuelve los datos json de una carrera por id
 */
exports.datosCarrera = function (req, res) {
	Carreras.findOne({'_id': req.params.carrera})
		.populate('universidad')
		.populate({
			path: 'asignaturas',
			populate: {path : 'profesores',
				populate: { path: 'votos'}}})
		.exec(function(err, carrera){

			if (err) res.send(500, err.message);

			if (carrera === null)
			{
				res.status(404).send({error: "Esa carrera no existe"})
			}
			else
			{
				res.status(200).jsonp(carrera);
			}
		});
};