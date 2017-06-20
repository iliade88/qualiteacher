var mongoose = require('mongoose');  
var Universidades  = mongoose.model('Universidades');

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
}