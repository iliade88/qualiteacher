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

			res.status(200).jsonp(carreras);
		});
};

/**
 * Recupera los datos de la carrera por id y los muestra en la vista de detalle
 */
exports.detalleCarrera = function (req, res) {
	Carreras.findOne({'_id': req.params.carrera})
		.populate('universidad')
		.populate('asignaturas')
		.exec(function(err, carrera){

			if (err) console.log(err);

			if (carrera === null)
			{
				res.status(400).send({"error": "Esa asignatura no existe"})
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

			if (err) console.log(err);

			if (carrera === null)
			{
				res.status(400).send({"error": "Esa asignatura no existe"})
			}
			else
			{
				console.log(carrera)
				res.status(200).jsonp(carrera);
			}
		});
};