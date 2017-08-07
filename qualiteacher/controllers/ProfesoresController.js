var mongoose = require('mongoose');
var Profesores = mongoose.model('Profesores');

var AsignaturasController = require('./AsignaturasController');
var UtilsController = require('./UtilsController');

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
};

exports.findById = function (id_profesor) {

	Profesores
		.findOne()
		.where('_id')
		.equal(id_profesor)
		.exec(function (err, profesor) {

			if (err) console.log(err);

			return profesor;
		});
};

exports.findByIds = function(arry_ids)
{
	Profesores.find()
		.where('_id')
		.in(array_ids)
		.exec(function (err, profesores)
		{
			return profesores;
		})
};

function printRecuento(asignaturas)
{
	for (var i = 0; i < asignaturas.length; i++)
	{
		console.log("Voto de la asignatura "+asignaturas[i]._id)

		for (var j = 0; j < asignaturas[i].recuento_notas_por_pregunta.length; j++)
		{
			console.log("Pregunta "+ (j+1));
			for (var k = 0; k < asignaturas[i].recuento_notas_por_pregunta[j].length; k++)
			{
				console.log("Nota " + k + " " + asignaturas[i].recuento_notas_por_pregunta[j][k] + "veces")
			}
		}
	}
}

exports.generaAsignaturasProfesorConNota = function(profesor)
{
	var asignaturas = [];
	for (var i = 0; i < profesor.asignaturas.length; i++)
	{
		asignaturas.push({
			_id : profesor.asignaturas[i]._id,
			nombre: profesor.asignaturas[i].nombre,
			codigo: profesor.asignaturas[i].codigo,
			recuento_notas_por_pregunta: UtilsController.generaMatrizRecuentoNotasPorPregunta()
		});
	}

	for (var i = 0; i < profesor.votos.length; i++)
	{
		var indice_asignatura = buscaAsignatura(asignaturas, profesor.votos[i].asignatura);
		for (var j = 0; j < 10; j++)
		{
			var nota_pregunta = profesor.votos[i].cuestionario[j];
			asignaturas[indice_asignatura].recuento_notas_por_pregunta[j][nota_pregunta]++;
		}
	}

	return asignaturas;
};

/*
 * Prepara el profesor y los votos para ser enviados al cliente con la nota de una asignatura concreta
 * @Param1: Profesor con los votos expandidos
 * @Param2: id de la asignatura de la que queremos la nota
 */
exports.generaProfesorConNotaAsignatura = function(profesor, asignatura)
{
	var profesor_con_nota = {
		_id : profesor._id,
		nombre : profesor.nombre,
		recuento_notas_por_pregunta: UtilsController.generaMatrizRecuentoNotasPorPregunta()
	};

	for (var i = 0; i < profesor.votos.length; i++)
	{
		if ("" + profesor.votos[i].asignatura === "" + asignatura)
		{
			for (var j = 0; j < 10; j++)
			{
				var nota_pregunta = profesor.votos[i].cuestionario[j];
				profesor_con_nota.recuento_notas_por_pregunta[j][nota_pregunta]++;
			}
		}
	}

	return profesor_con_nota;
};

/**
 * Busca los datos del profesor pasado por id y renderiza la vista de profesor con dichos datos
 */
exports.detalleProfesor = function(req, res) {
	Profesores.findOne({'_id': req.params.profesor})
	.populate({
		path: 'asignaturas',
		select: 'nombre codigo'})
	.exec(function(err, profesor){

		if (err) console.log(err);

		if (profesor === null)
		{
			res.status(400).send({"error": "Ese profesor no existe"})
		}
		else
		{
			var asignaturas_con_nota = generaAsignaturasProfesorConNota(profesor);
			var profesor_para_vista = {
				nombre: profesor.nombre,
				universidad: profesor.universidad,
				asignaturas : asignaturas_con_nota
			};
			console.log(JSON.stringify(profesor_para_vista));
			res.render('profesor', {title: 'Qualiteacher | Calificar', profesor: profesor_para_vista})
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
 * Función que devuelve las notas actualizadas tras votar a un profesor
 * @param profesor: instancia profesor de mongoose a actualizar
 * @param asignatura: el id de la asignatura que se ha votado
 * @param calificacion: Array de 10 elementos con las respuestas al cuestionario
 */
exports.calculaNotas = function(profesor, id_asignatura, calificacion)
{
	sumaVotoANumNotasPP(profesor.num_notas_pp, profesor.num_votos, calificacion);
	profesor.nota = recalculaNota(profesor.num_notas_pp, profesor.num_votos);

	var indice_asignatura = buscaAsignatura(profesor.notas_asignaturas_prof, id_asignatura);

	if (indice_asignatura === -1)
	{
		//Crear nueva "estructura" para almacenarla en el vector de notas del profesor
		var nueva_asignatura_votada = {
			asignatura: id_asignatura,
			nota_asignatura: 0,
			num_nota_pp: UtilsController.generaMatrizRecuentoNotasPorPregunta(),
			num_votos: 0
		}

		sumaVotoANumNotasPP(nueva_asignatura_votada.num_notas_pp, nueva_asignatura_votada.num_votos, calificacion);
		nueva_asignatura_votada.nota_asignatura = recalculaNota(nueva_asignatura_votada.num_notas_pp, nueva_asignatura_votada.num_votos);

		profesor.notas_asignaturas_prof.push(nueva_asignatura_votada);
	}
	else
	{
		sumaVotoANumNotasPP(profesor.notas_asignaturas_prof[indice_asignatura].num_notas_pp, profesor.notas_asignaturas_prof[indice_asignatura].num_votos, calificacion);
	}
}

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

			var usuario = req.body.usuario;

			calculaNotas(profesor, req.params.asignatura, calificacion);

			Profesores
				.save(function (err)
				{
					if(err) { console.log(err); return next(err);}

					console.log("Profesor actualizado.")
				})
				.then(function () {
					Usuarios.findOne({'_id': usuario}, function (err, usuario)
					{
						if(err) { console.log(err); return next(err);}

						var voto = {
							profesor: req.params.profesor,
							asignatura: req.params.asignatura
						};

						usuario.votos.push(voto);

						usuario.save(function (err)
						{
							if(err) { console.log(err); return next(err);}

							console.log("Profesor actualizado.")
						})
					})
				})
				.then(function()
				{
					AsignaturasController.actualizarNotasAsignatura(req.params.asignatura, calificacion);
				})
		}
	});
};