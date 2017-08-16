var mongoose = require('mongoose');
var Usuarios = mongoose.model('Usuarios');
var config = require('../config');
var jwt = require('jwt-simple');
var bcrypt = require('bcrypt')

var UniversidadesController = require('./UniversidadesController')
var AuthController = require('./AuthController')
var UtilsController = require('./UtilsController')

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
			bcrypt.hash(req.body.contrasenya, 8, function(err, hash) {
				var usuario = new Usuarios({
					_id: mongoose.Types.ObjectId() + '',
					nick : req.body.nickname,
					email : req.body.email,
					contrasenya : hash,
					universidad : req.body.universidad
				});

				usuario['token_activacion'] = AuthController.crearToken(usuario, 1);

				console.log("\r\nCreado:" + usuario)

				usuario.save(function(err, usuario){

					if(err) { console.log(err); return next(err);}

					//Si no hay error se ha guardado y lo añadimos a la universidad como alumno
					UniversidadesController.anyadirAlumno(req, usuario._id, next);

					//Para no enviar la contraseña en la respuesta
					delete usuario.contrasenya;
					res.status(200).send({usuario: usuario});

					UtilsController.mandarEmailActicacion(usuario.email, usuario.nick, usuario.token_activacion);
				})
			});
		}
		else
		{
			res.status(400).send({error: "Ya existe ese nick"});
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
			res.status(401).send({error: "Credenciales no válidas"});
		}
		else
		{

			if (usuario.activado == 0)
			{
				res.status(401).send({error: "Debes activar tu cuenta para poder loguear"});
			}
			else if (bcrypt.compareSync(req.body.contrasenya, usuario.contrasenya))
			{
				console.log("200")
				console.log("\r\nLogin correcto:" + usuario)

				usuario['token'] = AuthController.crearToken(usuario, 10);

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
				res.status(401).send({error: "Credenciales no válidas"});
			}
		}
	})
};

exports.activarUsuario = function(req, res, next)
{
	console.log("Activar");

	var token_activacion = req.params.token;

	var payload = jwt.decode(token_activacion, config.TOKEN_SECRET);
	var id_usuario = payload.sub;

	Usuarios.findOne({'_id': id_usuario}, function(err, usuario)
	{
		if (err) { console.log(err); return next(err); }
		//Si el nick no existe en la db
		if (usuario === null)
		{
			res.redirect(301, '/');
		}
		else
		{
			if (usuario.token_activacion.localeCompare(token_activacion) == 0)
			{
				usuario.activado = 1;
				usuario.save(function(err)
				{
					if (err) { console.log(err); return next(err); }

					res.render('activacionCompletada', {title : 'Qualiteacher | Activación completada'})
				});
			}
			else
			{
				res.render('activacionError', {title : 'Qualiteacher | Error Activación'})
			}
		}
	})
};

exports.vistaRecuperarContrasenya = function(req, res, next)
{
	res.render('recuperarContrasenyaForm', {title: 'Qualiteacher | Recuperar contraseña'});
}

exports.vistaContrasenyaCambiada = function(req, res, next)
{
	res.render('recuperarContrasenyaCompletado', {title: 'Qualiteacher | Recuperar contraseña'});
}

exports.vistaCambiarContrasenya = function(req, res)
{
	var token = req.params.token

	var id_usuario = ""
	console.log(token)
	try {
		var payload = jwt.decode(token, config.TOKEN_SECRET);
		id_usuario = payload.sub;
	}
	catch(err)
	{
		res.render('recuperarContrasenyaError', {title : 'Qualiteacher | Error recuperación'})
		return;
	}

	Usuarios.findOne({'_id': id_usuario}, function(err, usuario)
	{
		if (err) { console.log(err); return next(err); }
		//Si el nick no existe en la db
		if (usuario === null)
		{
			res.redirect(301, '/');
		}
		else
		{
			if (usuario.token_rec_contrasenya.localeCompare(token) == 0)
			{
				res.render('recuperarContrasenyaNueva', {title : 'Qualiteacher | Recuperar contraseña', token: token})
			}
			else
			{
				res.render('recuperarContrasenyaError', {title : 'Qualiteacher | Error recuperación'})
			}
		}
	})
}

exports.cambiarContrasenya = function (req, res, next)
{
	var token = req.body.token;
	var nueva_contrasenya = req.body.contrasenya;
	var id_usuario = "";

	try {
		var payload = jwt.decode(token, config.TOKEN_SECRET);
		id_usuario = payload.sub;
	}
	catch(err)
	{
		res.status(400).send({error: 'El token ha expirado.'});
		return;
	}

	Usuarios.findOne({'_id': id_usuario}, function(err, usuario)
	{
		if (err) { console.log(err); return next(err); }
		//Si el id no existe en la db
		if (usuario === null)
		{
			res.redirect(301, '/');
		}
		else
		{
			if (usuario.token_rec_contrasenya.localeCompare(token) == 0)
			{
				bcrypt.hash(nueva_contrasenya, 8, function(err, hash) {

					if (err) { console.log(err); return next(err); }

					usuario.contrasenya = hash;
					usuario.token_rec_contrasenya = "-";
					usuario.save(function (err){

						if (err) { console.log(err); return next(err); }

						res.status(200).send({mensaje: 'Contraseña cambiada correctamente.'})
					});
				});
			}
			else
			{
				res.status(400).send({error: 'El token no es válido.'})
			}
		}
	})

}

exports.enviarEmailRecuperarContrasenya = function(req, res, next)
{
	var email = req.body.email
	console.log("Recuperar"+email);

	Usuarios.findOne({'email': email}, function (err, usuario)
	{
		if (err) { console.log(err); return next(err); }
		//Si el nick no existe en la db
		if (usuario === null)
		{
			res.status(400).send({error: "No existe ningún usuario con esa dirección de correo."})
		}
		else
		{
			var token_recuperar_contrasenya = AuthController.crearToken(usuario, 1);
			UtilsController.mandarEmailRecuperarContrasenya(email, token_recuperar_contrasenya);

			usuario["token_rec_contrasenya"] = token_recuperar_contrasenya;
			usuario.save(function(err)
			{
				if (err) { console.log(err); return next(err); }

				res.status(200).send({mensaje: "Email enviado. Comprueba tu bandeja de entrada y la bandeja de spam."})
			});
		}
	})


}