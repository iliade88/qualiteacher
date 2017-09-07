var nodemailer = require('nodemailer');

exports.generaMatrizRecuentoNotasPorPregunta = function()
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

exports.buscaAsignatura = function(array, id_asignatura)
{
	for (var i = 0; i < array.length; i++)
	{
		if (""+array[i].asignatura === ""+id_asignatura) return i;
	}
	return -1;
};

/**
 * Cuenta las veces que se ha dado una calificación y aumenta el número de votos
 * @param obj
 * @param calificacion
 */
exports.sumaVotoANumNotasPP = function(obj, calificacion)
{
	for (var i = 0; i < calificacion.length; i++)
	{
		var nota_pregunta = calificacion[i];
		obj.num_notas_pp[i][nota_pregunta]++;
	}
	console.log("DENTRO")
	console.log(obj.num_notas_pp)
	return obj.num_votos++;
}

/**
 * Calcula la nota final
 * @param num_notas_pp: Matriz con el conteo de notas por pregunta
 * @param num_votos: Número de veces que se ha votado el par profesor/asignatura
 * @returns {number}: Nota final (del profesor o de la asignatura para ese profesor)
 */
exports.recalculaNota = function(num_notas_pp, num_votos)
{
	var nota = 0;

	for (var i = 0; i < num_notas_pp.length; i++)
	{
		var suma_pregunta = 0;
		for (var j = 0; j < num_notas_pp[i].length; j++)
		{
			suma_pregunta += (num_notas_pp[i][j] * j) / num_votos;
		}

		nota += (suma_pregunta / 10);
	}

	return nota;
};

exports.addNumNotasPP = function(num_notas_pp, num_votos, num_notas_pp_add, num_votos_add)
{
	for (var i = 0; i < num_notas_pp.length; i++)
	{
		for (var j = 0; j < num_notas_pp[i].length; j++)
		{
			num_notas_pp[i][j] += num_notas_pp_add[i][j];
		}
	}
	num_votos += num_votos_add
};

function createTransportQualiteacher()
{
	return nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'qualiteacher17@gmail.com',
			pass: 'JttNgtQ9'
		}
	});
}

exports.mandarEmailActicacion = function(email, nick, token_activacion)
{
	var transporter = createTransportQualiteacher();

	var url_activacion = "http://qualiteacher.heroku.com/usuarios/activar/"+token_activacion
	//var url_activacion = "http://localhost:3000/usuarios/activar/"+token_activacion
	var mailOptions = {
		from: 'qualiteacher17@gmail.com',
		to: email,
		subject: 'Confirmación de registro',
		html: '<h1>¡Gracias por registrarte!</h1>' +
				'<hr>' +
			'<p>Para poder votar a tus profesores, antes debes activar tu cuenta. Para ello, pincha en el siguiente enlace <a href="'+url_activacion+'">'+url_activacion+'</a></p>' +
			'<p>Un saludo, el equipo de Qualiteacher</p>'
	};

	transporter.sendMail(mailOptions, function(error, info){
		if (error) {
			console.log(error);
		} else {
			console.log('Email sent: ' + info.response);
		}
	});
}

exports.mandarEmailRecuperarContrasenya = function(email, token)
{
	var transporter = createTransportQualiteacher();

	var url_restablecer_contrasenya = "http://qualiteacher.heroku.com/usuarios/recuperar/"+token
	//var url_restablecer_contrasenya = "http://localhost:3000/usuarios/recuperar/"+token
	var mailOptions = {
		from: 'qualiteacher17@gmail.com',
		to: email,
		subject: 'Recuperación de contraseña',
		html: '<h1>Qualiteacher - Ayuda de recuperación de contraseña</h1>' +
		'<hr>' +
		'<p>Por motivos de seguridad no podemos enviarte tu contraseña. Sin embargo, puedes establecer una nueva pinchando en el siguiente enlace<br>' +
		'<a href="'+url_restablecer_contrasenya+'">'+url_restablecer_contrasenya+'</a></p>' +
		'<p>Un saludo, el equipo de Qualiteacher</p>'
	};

	transporter.sendMail(mailOptions, function(error, info){
		if (error) {
			console.log(error);
		} else {
			console.log('Email sent: ' + info.response);
		}
	});
}