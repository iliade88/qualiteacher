var mongoose = require('mongoose');
var Profesores = mongoose.model('Profesores');
var Votos = mongoose.model('Votos');

/**
 * Devolver todos los profesores
 */
exports.findAll = function(req, res) {

	Profesores.find(function(err, profesor) {
		if(err) res.send(500, err.message);

		console.log('GET /Profesores')
		res.status(200).jsonp(profesor);
	});
};

/**
 * Busca profesores por nombre
 */
exports.findByName = function (req, res) {

	var nombre = decodeURI(req.params.nombre);
	var query = {'nombre': new RegExp(nombre, "i")};

	Profesores.find(query)
	.exec(function (err, profesores) {
		if (err) console.log(err);

		if (profesores === null)
			res.status(400).send({"error": "No existen profesores con ese nombre"})
		else
			res.send(profesores);
	});
}

/**
 * Busca los datos del profesor pasado por id y renderiza la vista de profesor con dichos datos
 */
exports.detalleProfesor = function(req, res) {
	Profesores.findOne({'_id': req.params.profesor})
	.populate('asignaturas')
	.populate('votos')
	.exec(function(err, profesor){

		if (err) console.log(err);

		if (profesor === null)
		{
			res.status(400).send({"error": "Ese profesor no existe"})
		}
		else
		{
			console.log(JSON.stringify(profesor));
			res.render('profesor', {title: 'Qualiteacher | Calificar', profesor: profesor})
		}
	});
};

/*
 * Mostramos la vista de calificar
 */
exports.vistaCalificar = function (req, res) {
	console.log("Entrada:\r\n" +JSON.stringify(req.params, null, 4))
	Profesores.findOne({'_id': req.params.profesor})
		.populate('asignaturas')
		.exec(function(err, profesor){

		if (err) console.log(err);

		if (profesor === null)
		{
			res.status(400).send({"error": "Ese profesor no existe"})
		}
		else
		{
			console.log(JSON.stringify(profesor));
			res.render('calificar', {title: 'Qualiteacher | Calificar', profesor: profesor})
		}
	});
};

/**
 * Recibidas las calificaciones del profesor, las añadimos a la db y al profesor votado en base a una asignatura
 **/
exports.calificarProfesor = function (req, res, next) {
	Profesores.findOne({'_id': req.params.profesor}, function(err, profesor){

		console.log("Entrada:\r\n" +JSON.stringify(req.body, null, 4))

		if (err) console.log(err);

		if (profesor === null)
		{
			res.status(400).send({"error": "Ese profesor no existe"})
		}
		else
		{
			var calificacion = [req.body.pr1, req.body.pr2, req.body.pr3, req.body.pr4, req.body.pr5, req.body.pr6, req.body.pr7, req.body.pr8, req.body.pr9, req.body.pr10]

			console.log(calificacion);
			var voto = new Votos({
				cuestionario: calificacion,
				profesor: req.params.profesor,
				asignatura: req.params.asignatura});
			console.log("Voto:" + JSON.stringify(voto));
			voto.save(function (err, voto)
			{
				if(err) { console.log(err); return next(err);}

				profesor.votos.push(voto._id);
				profesor.save(function(err, prof){
					if(err) { console.log(err); return next(err);}

					res.status(200).send("Voto correctamente registrado");
				});
			})
		}
	});
};