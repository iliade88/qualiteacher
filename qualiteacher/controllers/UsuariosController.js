var mongoose = require('mongoose');  
var Usuarios = mongoose.model('Usuarios');

var UniversidadesController = require('./UniversidadesController')

exports.findUsers = function(req, res, next) {
	Usuarios
	.find()
	.populate('universidad')
	.exec(function (err, usuario) {
		if (err) console.log(err)

		console.log(usuario)
		res.json(usuario)
	});
}

exports.anyadirUsuario = function(req, res, next) {
	
	Usuarios.findOne({'nick': req.body.nickname}, function(err, usuarios){

		console.log("Entrada:\r\n" +JSON.stringify(req.body, null, 4))

		if (err) console.log(err);
		//Si el nick no existe en la db
		if (usuarios == null)
		{
			var usuario = new Usuarios({
				nick : req.body.nickname,
				email : req.body.email,
				contrasenya : req.body.contrasenya,
				universidad : req.body.universidad
			})

			console.log("\r\nCreado:" + usuario)

			usuario.save(function(err, usuario){

				if(err) { console.log(err); return next(err);}

				//Si no hay error se ha guardado y lo añadimos a la universidad como alumno
				UniversidadesController.anyadirAlumno(req, usuario, next);
				
				res.status(200);
			})

		}
		else
		{
			res.status(400).send({"error": "Ya existe ese nick"});
		}
	})
}