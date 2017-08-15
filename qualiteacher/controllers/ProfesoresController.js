var mongoose = require('mongoose');
var Profesores = mongoose.model('Profesores');
var Usuarios = mongoose.model('Usuarios');

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
	.select('_id nombre')
	.exec(function (err, profesores) {
		if (err) console.log(err);

		if (profesores === null)
			res.status(400).send({"error": "No existen profesores con ese nombre"})
		else
			res.send(profesores);
	});
};

exports.findById = function (req,res) {

	Profesores
		.findOne({'_id': req.params.id})
		.exec(function (err, profesor) {

			if (err) { console.log(err); res.status(400).send(); }

			res.status(200).send(profesor);
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
		var indice_asignatura = UtilsController.buscaAsignatura(asignaturas, profesor.votos[i].asignatura);
		for (var j = 0; j < 10; j++)
		{
			var nota_pregunta = profesor.votos[i].cuestionario[j];
			asignaturas[indice_asignatura].recuento_notas_por_pregunta[j][nota_pregunta]++;
		}
	}

	return asignaturas;
};

/**
 * Busca los datos del profesor pasado por id y renderiza la vista de profesor con dichos datos
 */
exports.detalleProfesor = function(req, res) {
	Profesores.findOne({'_id': req.params.profesor})
	.populate({
		path: 'notas_asignaturas_prof.asignatura',
		select: 'nombre codigo'})
	.exec(function(err, profesor){

		if (err) console.log(err);

		if (profesor === null)
		{
			res.status(400).send({"error": "Ese profesor no existe"})
		}
		else
		{
			res.render('profesor', {title: 'Qualiteacher | '+profesor.nombre, profesor: profesor});
		}
	});
};

/*
 * Mostramos la vista de calificar
 */
exports.vistaCalificar = function (req, res) {
	console.log("Entrada:\r\n" +JSON.stringify(req.params, null, 4))
	Profesores.findOne({'_id': req.params.profesor})
		.populate({path: 'notas_asignaturas_prof.asignatura'})
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
 * @param id_asignatura: el id de la asignatura que se ha votado
 * @param calificacion: Array de 10 elementos con las respuestas al cuestionario
 */
function calculaNotas(profesor, id_asignatura, calificacion)
{
	UtilsController.sumaVotoANumNotasPP(profesor, calificacion);
	profesor.nota = UtilsController.recalculaNota(profesor.num_notas_pp, profesor.num_votos);

	var indice_asignatura = UtilsController.buscaAsignatura(profesor.notas_asignaturas_prof, id_asignatura);

	if (indice_asignatura === -1)
	{
		//Crear nueva "estructura" para almacenarla en el vector de notas del profesor
		var nueva_asignatura_votada = {
			asignatura: id_asignatura,
			nota_asignatura: 0,
			num_nota_pp: UtilsController.generaMatrizRecuentoNotasPorPregunta(),
			num_votos: 0
		}

		UtilsController.sumaVotoANumNotasPP(nueva_asignatura_votada, calificacion);
		nueva_asignatura_votada.nota_asignatura = UtilsController.recalculaNota(nueva_asignatura_votada.num_notas_pp, nueva_asignatura_votada.num_votos);

		profesor.notas_asignaturas_prof.push(nueva_asignatura_votada);
	}
	else
	{
		UtilsController.sumaVotoANumNotasPP(profesor.notas_asignaturas_prof[indice_asignatura], calificacion);
	}
}

function profesorYaVotadoParaAsignatura(votos, id_profesor, id_asignatura)
{
	for (var i = 0; i < votos.length; i++)
	{
		if (votos[i].profesor.localeCompare(id_profesor) === 0 && votos[i].asignatura.localeCompare(id_asignatura) === 0)
		{
			return i;
		}
	}
	return -1;
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
			var usuario = req.body.usuario;

			Usuarios.findOne({'nick': usuario}, function (err, usuario) //Buscamos al votante...
			{
				if(err) { console.log(err); return next(err);}

				var voto = {
					profesor: req.params.profesor,
					asignatura: req.params.asignatura
				};

				//Y comprobamos que no haya votado ya al par seleccionado, si es así, devolvemos error
				if (profesorYaVotadoParaAsignatura(usuario.votos, voto.profesor, voto.asignatura) != -1)
				{
					res.status(400).send({error: 'Profesor ya votado'})
				}
				else //Si no había sido votado
				{
					usuario.votos.push(voto);

					console.log("PROFESOR PRE-VOTO")
					console.log(profesor)
					var calificacion = [req.body.pr1, req.body.pr2, req.body.pr3, req.body.pr4, req.body.pr5, req.body.pr6, req.body.pr7, req.body.pr8, req.body.pr9, req.body.pr10]
					//Recalculamos notas del profesor
					calculaNotas(profesor, req.params.asignatura, calificacion);

					profesor
						.save(function (err) //Actualizamos el profesor
						{
							if(err) { console.log(err); return next(err);}

							console.log("Profesor actualizado.")
						})
						.then(function()
						{
							usuario.save(function (err) //Guardamos el voto en el usuario
							{
								if (err) { console.log(err); return next(err); }

								console.log("Usuario actualizado.");
							});
						})
						.then(function() ////Actualizamos la asignatura
						{
							AsignaturasController.actualizarNotasAsignatura(req.params.asignatura, calificacion);
						})
						.then(function()
						{
							res.status(200).send();
						})
				}

			})
		}
	});
};