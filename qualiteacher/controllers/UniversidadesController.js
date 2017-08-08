var mongoose = require('mongoose');  
var Universidades  = mongoose.model('Universidades');
var CarrerasController = require('../controllers/CarrerasController')

/**
* Devolver todas las universidades
*/
exports.findAll = function(req, res) {  
    Universidades.find(function(err, universidad) {
    	if(err) res.send(500, err.message);

    	console.log('GET /Universidades')
        res.status(200).jsonp(universidad);
    });
};

/**
* Recibido un alumno lo añadimos al vector de alumnos de la universidad
**/
exports.anyadirAlumno = function(req, nuevo_alumno, next) {
	
	Universidades.findOne({_id : req.body.universidad}, function(err, universidad){

		if(err) { console.log(err); return next(err);}
		
		console.log("\r\nVamos a añadir alumno a: "+universidad)
		universidad.alumnos.push(nuevo_alumno._id);
		
		console.log("\r\nAñadido alumno a: "+universidad)
		universidad.save(function(err, universidad){
			if(err) { console.log(err); return next(err);}

			return true;
		});
		console.log("\r\nGuardado")

	})
};

/**
 * Recuperar datos de la universidad y mostrar vista detalle
 */
exports.detalleUniversidad = function (req, res) {
	Universidades.findOne({'_id': req.params.universidad})
		.populate('carreras')
		.populate('profesores')
		.exec(function(err, universidad){

			if (err) console.log(err);

			if (universidad === null)
			{
				res.status(400).send({"error": "Esa universidad no existe"})
			}
			else
			{
				var top_five_carreras = [];
				var top_five_profesores = [];


				console.log(universidad)
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
