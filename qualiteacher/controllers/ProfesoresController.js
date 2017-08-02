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

function generaMatrizRecuentoNotasPorPregunta()
{
	var recuento_notas_por_pregunta = [10];
	//Inicializamos el array a 0
	for (var i = 0; i < 10; i++)
	{
		recuento_notas_por_pregunta[i] = new Array(11);

		for (var j = 0; j <= 10; j ++)
		{
			recuento_notas_por_pregunta[i][j] = 0;
		}
	}

	return recuento_notas_por_pregunta;
}

function buscaAsignatura(array, id_asignatura)
{
	for (var i = 0; i < array.length; i++)
	{
		if (""+array[i]._id === ""+id_asignatura) return i;
	}
	return -1;
}

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
			recuento_notas_por_pregunta: generaMatrizRecuentoNotasPorPregunta()
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
		recuento_notas_por_pregunta: generaMatrizRecuentoNotasPorPregunta()
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
	.populate('votos')
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