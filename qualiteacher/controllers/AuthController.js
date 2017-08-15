var config = require('../config');
var jwt = require('jwt-simple');
var moment = require('moment');

exports.crearToken = function(usuario) {
	var payload = {
		sub: usuario._id,
		iat: moment().unix(),
		exp: moment().add(14, "days").unix(),
	};
	return jwt.encode(payload, config.TOKEN_SECRET);
};

exports.ensureAuthenticated = function(req, res, next) {
	if(!req.headers.authorization) {
		return res
			.status(403)
			.send({message: "Tu petición no tiene cabecera de autorización"});
	}

	var auth_tokens = req.headers.authorization.split(" ");

	if (auth_tokens.length < 1)
	{
		return res
			.status(403)
			.send({message: "Tu petición no tiene token"});
	}

	try {

		var token = req.headers.authorization.split(" ")[1];
		var payload = jwt.decode(token, config.TOKEN_SECRET);

		if(payload.exp <= moment().unix()) {
			return res
				.status(401)
				.send({message: "El token ha expirado"});
		}

		req.user = payload.sub;
		next();
	}
	catch(err)
	{
		console.log(err);
		return res.status(401).send({message: 'Ocurrió un error en el servidor, por favor, inténtalo de nuevo más tarde.'});
	}

};