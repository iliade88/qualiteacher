var mongoose = require('mongoose');
var Universidades = mongoose.model('Universidades');
var Carreras = mongoose.model('Carreras');
var Asignaturas = mongoose.model('Asignaturas');
var Profesores = mongoose.model('Profesores');

/* Muestra la vista de inicio */
exports.home = function(req, res) {
	res.render('index', { title: 'Qualiteacher' });
}

/* Busca la cadena introducida en el buscador de la página de inicio*/
exports.buscar = function(req, res) {

	var nombre = decodeURI(req.params.cadena);
	var query = {'nombre': new RegExp(nombre, "i")};
	console.log(query)

	Universidades.find(query)
	.limit(5)
	.exec(function (err, universidades) {
		if (err) console.log(err);

		Carreras.find(query)
			.limit(5)
			.exec(function (err, carreras) {
				if (err) console.log(err);

				Asignaturas.find(query)
					.limit(5)
					.exec(function (err, asignaturas) {
						if (err) console.log(err);

						Profesores.find(query)
							.limit(5)
							.exec(function (err, profesores) {
								if (err) console.log(err);

								var resultados = {
									universidades: universidades,
									carreras: carreras,
									asignaturas: asignaturas,
									profesores: profesores
								}
								res.send(resultados);
							});

					});
			});
	});
}

/* Muestra la vista de registro */
exports.registro = function(req, res) {
	res.render('registro', {title : 'Qualiteacher | Registro'});
}

/* Muestra la vista de registro completado */
exports.registroFinalizado = function(req, res) {
	res.render('registroCompletado', {title : 'Qualiteacher | Registro completado'});
}
