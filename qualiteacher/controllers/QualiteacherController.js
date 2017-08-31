var mongoose = require('mongoose');
var Universidades = mongoose.model('Universidades');
var Carreras = mongoose.model('Carreras');
var Asignaturas = mongoose.model('Asignaturas');
var Profesores = mongoose.model('Profesores');

var TopsController = require('./TopsController');

/* Muestra la vista de inicio */
exports.home = function(req, res) {
	TopsController
		.getTops()
		.exec(function (err, top)
		{
			if (err) res.send(500, err.message);
			res.render('index', { title: 'Qualiteacher', top: top });
		});
}

/* Busca la cadena introducida en el buscador de la página de inicio*/
exports.buscar = function(req, res) {

	var nombre = req.params.cadena;
	var query = {'nombre': new RegExp(nombre, "i")};

	Universidades.find(query)
	.select('_id nombre')
	.limit(5)
	.exec(function (err, universidades) {
		if (err) res.send(500, err.message);

		Carreras.find(query)
			.select('_id nombre universidad')
			.populate({
				path: 'universidad',
				select: 'nombre'
			})
			.limit(5)
			.exec(function (err, carreras) {
				if (err) res.send(500, err.message);

				Asignaturas.find(query)
					.select('_id nombre universidad carrera')
					.populate({
						path: 'carrera',
						select: 'nombre'
					})
					.populate({
						path: 'universidad',
						select: 'nombre'
					})
					.limit(5)
					.exec(function (err, asignaturas) {
						if (err) res.send(500, err.message);

						Profesores.find(query)
							.select('_id nombre universidad nota')
							.populate({
								path: 'universidad',
								select: 'nombre'
							})
							.limit(5)
							.exec(function (err, profesores) {
								if (err) res.send(500, err.message);

								var resultados = {
									universidades: universidades,
									carreras: carreras,
									asignaturas: asignaturas,
									profesores: profesores
								}
								res.status(200).send(resultados);
							});

					});
			});
	});
}

/* Muestra la vista de registro */
exports.login = function(req, res) {
	res.render('login', {title : 'Qualiteacher | Login'});
}

/* Muestra la vista de registro */
exports.registro = function(req, res) {
	res.render('registro', {title : 'Qualiteacher | Registro'});
}

/* Muestra la vista de registro completado */
exports.registroFinalizado = function(req, res) {
	res.render('registroCompletado', {title : 'Qualiteacher | Registro completado'});
}
