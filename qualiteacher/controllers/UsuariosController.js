var mongoose = require('mongoose');
var Usuarios = mongoose.model('Usuarios');

var UniversidadesController = require('./UniversidadesController')
var AuthController = require('./AuthController')

exports.findUsers = function(req, res, next) {
	Usuarios
	.find()
	.populate('universidad')
	.exec(function (err, usuario) {
		if (err) console.log(err)

		console.log(usuario)
		res.json(usuario)
	});
};

exports.anyadirUsuario = function(req, res, next) {
	
	Usuarios.findOne({'nick': req.body.nickname}, function(err, usuarios){

		console.log("Entrada:\r\n" +JSON.stringify(req.body, null, 4))

		if (err) { console.log(err); return next(err); }
		//Si el nick no existe en la db
		if (usuarios === null)
		{
			var usuario = new Usuarios({
				_id: mongoose.Types.ObjectId() + '',
				nick : req.body.nickname,
				email : req.body.email,
				contrasenya : req.body.contrasenya,
				universidad : req.body.universidad
			});

			usuario['token'] = AuthController.crearToken(usuario);

			console.log("\r\nCreado:" + usuario)

			usuario.save(function(err, usuario){

				if(err) { console.log(err); return next(err);}

				//Si no hay error se ha guardado y lo añadimos a la universidad como alumno
				UniversidadesController.anyadirAlumno(req, usuario._id, next);

				//Para no enviar la contraseña en la respuesta
				delete usuario.contrasenya;
				res.status(200).send({usuario: usuario});
			})
		}
		else
		{
			res.status(400).send({"error": "Ya existe ese nick"});
		}
	})
};

exports.login = function (req, res, next)
{
	console.log("Login")
	Usuarios.findOne({'nick': req.body.nickname}, function(err, usuario){

		console.log("Entrada:\r\n" +JSON.stringify(req.body, null, 4))

		if (err) { console.log(err); return next(err); }
		//Si el nick no existe en la db
		if (usuario === null)
		{
			console.log("401-1")
			res.status(401).send({"error": "Credenciales no válidas"});
		}
		else
		{
			if (usuario.contrasenya.localeCompare(req.body.contrasenya) === 0)
			{
				console.log("200")
				console.log("\r\nLogin correcto:" + usuario)

				usuario['token'] = AuthController.crearToken(usuario);

				usuario.save(function (err, usuario) {
					var usuario_local_storage = {
						nick: usuario.nick,
						email: usuario.email,
						img: usuario.img,
						universidad: usuario.universidad,
						token: usuario.token
					}
					res.status(200).send({usuario: usuario_local_storage});
				});
			}
			else {
				console.log("401")
				res.status(401).send({"error": "Credenciales no válidas"});
			}
		}
	})
};