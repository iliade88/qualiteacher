var mongoose = require('mongoose');  
var Universidades  = mongoose.model('Universidades');
var CarrerasController = require('../controllers/CarrerasController')

/**
 * Devolver todas las universidades
 */
exports.findAll = function(req, res) {
	Universidades.find(function(err, universidad) {
		if(err) res.send(500, err.message);

		res.status(200).jsonp(universidad);
	});
};

/**
* Recibido un alumno lo añadimos al vector de alumnos de la universidad
**/
exports.anyadirAlumno = function(req, id_nuevo_alumno, next) {
	
	Universidades.findOne({_id : req.body.universidad}, function(err, universidad){

		if(err) return next(err);
		
		if (!universidad.hasOwnProperty("alumnos"))
		{
			universidad["alumnos"] = [];
		}
		universidad.alumnos.push(id_nuevo_alumno);
		
		universidad.save(function(err, universidad){
			if(err) return next(err);

			return true;
		});
	})
};

function obtenerTopN(objs, n)
{
	var objsOrdenados = objs.sort(function (a, b) { return b.nota - a.nota})
	return objsOrdenados.slice(0, n);
}

/**
 * Recuperar datos de la universidad y mostrar vista detalle
 */
exports.detalleUniversidad = function (req, res, next) {
	Universidades.findOne({'_id': req.params.universidad})
		.populate('carreras')
		.populate('profesores')
		.exec(function(err, universidad){

			if (err) res.send(500, err.message);

			if (universidad === null)
			{
				var err = new Error("Esa universidad no existe");
				err.status = 404;
				next(err);
			}
			else
			{
				universidad.carreras = obtenerTopN(universidad.carreras, 5);
				universidad.profesores = obtenerTopN(universidad.profesores, 5);

				res.render('universidad', {title: ('Qualiteacher | '+universidad.nombre), universidad: universidad})
			}
		});
};

exports.calculaNotas = function()
{
	var cursor = Universidades
		.find()
		.cursor();

	cursor.eachAsync(function(universidad) {
		CarrerasController.actualizaNotasCarreras(universidad)
	})
	.then(function()
	{
		console.log("Fin de la actualización de notas");
	});
};
