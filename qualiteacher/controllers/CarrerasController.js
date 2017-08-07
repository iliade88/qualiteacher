var mongoose = require('mongoose');
var Carreras = mongoose.model('Carreras');
var Asignaturas = mongoose.model('Asignaturas');
var UtilsController = require('./UtilsController');

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

function actualizaNotaCarrera(carrera)
{
	var datos_carrera = {
		nota : 0,
		num_notas_pp : UtilsController.generaMatrizRecuentoNotasPorPregunta(),
		num_votos : 0
	};

	var cursor = Asignaturas
		.find()
		.where('_id')
		.in(carrera.asignaturas)
		.cursor();

	return cursor.eachAsync(
		function(asignatura)
		{
			if (asignatura.num_votos !== undefined)
				UtilsController.addNumNotasPP(datos_carrera.num_notas_pp, datos_carrera.num_votos, asignatura.num_notas_pp, asignatura.num_votos)
		})
		.then(function()
		{
			return {
				nota: datos_carrera.nota,
				num_votos: datos_carrera.num_votos
			}
		});
	/*cursor.on('data', function(asignatura)
	{
		addNumNotasPP(datos_carrera.num_notas_pp, datos_carrera.num_votos, asignatura.num_notas_pp, asignatura.num_votos);
	});

	cursor.on('close', function(){
		carrera.nota = datos_carrera.nota;
		carrera.num_notas_pp = datos_carrera.num_notas_pp;
		carrera.num_votos = datos_carrera.num_votos
		carrera.save(function(err, carrera){
			if(err) { console.log(err); return next(err);}

			console.log("Carrera: "+carrera.nombre+" actualizada correctamente.")
		});
	})
	.then(function()
	{
		return {
			nota: datos_carrera.nota,
			num_votos: datos_carrera.num_votos
		}
	});*/
}

exports.actualizaNotasCarreras = function (universidad)
{
	var datos_uni = {
		nota: 0,
		num_votos: 0
	};

	var cursor = Carreras
					.find()
					.where('_id')
					.in(universidad.carreras)
					.cursor();

	return cursor.eachAsync(function (carrera)
	{
		actualizaNotaCarrera(carrera).then(function (datos_carrera)
		{
			if (datos_carrera.nota !== undefined && !isNaN(datos_carrera.nota) &&
				datos_carrera.num_votos !== undefined && !isNaN(datos_carrera.num_votos)){
				datos_uni.nota += datos_carrera.nota;

				datos_uni.num_votos += datos_carrera.votos;
			}
			else
			{
				console.log("ALGO HAY MAL")
			}
		});
	})
	.then(function()
	{
		console.log("Fin de la actualización de carreras, los resultados de la universidad "+universidad.nombre+"son:");
		console.log("Nota uni: "+datos_uni.nota+" - Num votos: "+ datos_uni.num_votos);
		universidad.nota = datos_uni.nota;
		if (!isNaN(datos_uni.num_votos))
			universidad.num_votos = datos_uni.num_votos;
		else
			universidad.num_votos = 0;
		universidad.save(function(err, universidad){
			if(err) { console.log(err); return next(err);}

			console.log("Universidad: "+universidad.nombre+" actualizada correctamente.")
		});
	});
};