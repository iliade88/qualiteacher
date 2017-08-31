var supertest = require('supertest');
var assert = require('assert')
var qualiteacher = require('../app');
var mongoose = require('mongoose')
var Usuarios = mongoose.model('Usuarios');
var AuthController = require("../controllers/AuthController");

describe('Suite Usuarios', function () {

	it('GET /usuarios/ - Obtener todos los usuarios', function (done) {
		supertest(qualiteacher)
			.get('/usuarios/')
			.expect(200)
			.expect('Content-Type', 'application/json; charset=utf-8', done);
	});

	var test_user = {
			nickname: "test_user",
			email: "test_user_qualiteacher@alu.ua.es",
			contrasenya: "testing_simulator",
			universidad: "59899b74b285c92a17d2e2da"
	};

	var usuario_creado;

	it('POST /usuarios/ - registro usuario correcto', function (done) {

		supertest(qualiteacher)
			.post('/usuarios/')
			.send(test_user)
			.expect(200)
			.expect('Content-Type', 'application/json; charset=utf-8')
			.expect(function (res) {
				usuario_creado = res.body.usuario;
				assert(usuario_creado.hasOwnProperty("_id"))
				assert(usuario_creado.hasOwnProperty("activado"))
				assert.equal(usuario_creado.activado, 0);
			})
			.end(done);
	});

	it('POST /usuarios/ - registro usuario incorrecto', function (done) {

		supertest(qualiteacher)
			.post('/usuarios/')
			.send(test_user)
			.expect(400, {error: "Ya existe ese nick"})
			.expect('Content-Type', 'application/json; charset=utf-8', done)
	});

	after(function (done) {
		Usuarios.findOne({"_id" : usuario_creado._id}).exec(function (err, usuario) {
			var token_activacion = AuthController.crearToken(usuario, 1)
			usuario["token_activacion"] = token_activacion
			usuario_creado["token_activacion"] = token_activacion

			usuario.save(function (err) {
				if (err) done(err);
				done();
			})
		});
	});

	it('GET /usuarios/activar/:token - Activar usuario error (token inválido)', function (done) {

		supertest(qualiteacher)
			.get('/usuarios/activar/' + usuario_creado.token_activacion + "a")
			.expect(500, done);
	});

	it('GET /usuarios/activar/:token - Activar usuario error (token válido pero no concuerda con el del usuario)', function (done) {
		var token_modificado = AuthController.crearToken(usuario_creado, 2);
		supertest(qualiteacher)
			.get('/usuarios/activar/' + token_modificado)
			.expect(200)
			.expect(function (response) {
				assert(response.text.indexOf('Se ha producido un error activando tu cuenta') !== -1);
			})
			.end(done);
	});

	it('GET /usuarios/activar/:token - Activar usuario correctamente', function (done) {
		supertest(qualiteacher)
			.get('/usuarios/activar/' + usuario_creado.token_activacion)
			.expect(200)
			.expect(function (response) {
				assert(response.text.indexOf('¡Activación completada!') !== -1);
			})
			.end(done)
	});

	it('POST /usuarios/login - Inicio de sesión incorrecto (usuario inexistente)', function (done) {
		supertest(qualiteacher)
			.post('/usuarios/login')
			.send({
				nickname: "Manuel",
				contrasenya: "123456"
			})
			.expect(401, {error: "Credenciales no válidas"}, done);
	});

	describe("Inicio de sesión de usuario no activado", function(){
		beforeEach("Desactivando usuario para login incorrecto", function (done) {
			Usuarios.findOneAndUpdate({"_id" : usuario_creado._id}, {$set:{activado: 0}}, {new : true}, function(err, usuario_actualizado){
				if (err) done(err);
				done();
			})
		});

		afterEach(function (done) {
			Usuarios.findOne({"_id" : usuario_creado._id}).exec(function (err, usuario) {
				usuario.activado = 1

				usuario.save(function (err) {
					if (err) done(err);
					done();
				})
			});
		});

		it('POST /usuarios/login - Inicio de sesión incorrecto (usuario no activado)', function (done) {
			supertest(qualiteacher)
				.post('/usuarios/login')
				.send({
					nickname: test_user.nickname,
					contrasenya: test_user.contrasenya
				})
				.expect(401, {error: "Debes activar tu cuenta para poder loguear"}, done);
		});
	});

	it('POST /usuarios/login - Inicio de sesión incorrecto (no concuerda contraseña)', function (done) {
		supertest(qualiteacher)
			.post('/usuarios/login')
			.send({
				nickname: usuario_creado.nick,
				contrasenya: test_user.contrasenya + "fallo"
			})
			.expect(401, {error: "Credenciales no válidas"}, done);
	});

	it('POST /usuarios/login - Inicio de sesión incorrecto (no concuerda contraseña)', function (done) {
		supertest(qualiteacher)
			.post('/usuarios/login')
			.send({
				nickname: usuario_creado.nick,
				contrasenya: test_user.contrasenya
			})
			.expect(200)
			.expect('Content-Type', 'application/json; charset=utf-8')
			.expect(function (res) {
				var usuario_logueado = res.body.usuario;
				assert(usuario_logueado.hasOwnProperty("nick"));
				assert(usuario_logueado.hasOwnProperty("email"));
				assert(!usuario_logueado.hasOwnProperty("contrasenya"));
				assert(usuario_logueado.hasOwnProperty("universidad"));
				assert(usuario_logueado.hasOwnProperty("token"));
			})
			.end(done)
	});

	it('GET /usuarios/recuperar - Vista recuperar contraseña', function (done) {
		supertest(qualiteacher)
			.get('/usuarios/recuperar')
			.expect(200)
			.expect(function (response)
			{
				assert(response.text.indexOf('Recuperar contraseña') !== -1);
				assert(response.text.indexOf('Email universitario') !== -1);
			})
			.end(done);
	});

	it('POST /usuarios/email-recuperar-contrasenya - Enviar email recuperacion contraseña (email no existe)', function (done) {
		supertest(qualiteacher)
			.post('/usuarios/email-recuperar-contrasenya')
			.send({email: "correo_invalido_test_qualiteacher17@gmail.com"})
			.expect(400, {error: "No existe ningún usuario con esa dirección de correo."}, done);
	});

	it('POST /usuarios/email-recuperar-contrasenya - Enviar email recuperacion contraseña (correcto)', function (done) {
		supertest(qualiteacher)
			.post('/usuarios/email-recuperar-contrasenya')
			.send({email: test_user.email})
			.expect(200, {mensaje: "Email enviado. Comprueba tu bandeja de entrada y la bandeja de spam."}, done);
	});

	describe('Recuperación de contraseña', function () {

		var token_recuperacion = "";
		beforeEach(function(done){
			token_recuperacion = AuthController.crearToken(usuario_creado, 1);

			Usuarios.findOne({"_id" : usuario_creado._id}).exec(function (err, usuario) {
				if (err) done(err);
				usuario.token_rec_contrasenya = token_recuperacion;
				usuario.save(function(err) {
					if (err) done(err);
					done();
				})
			})
		});

		it('GET /usuarios/recuperar/:token - Vista nueva contraseña (fallo token no válido)', function (done) {
			supertest(qualiteacher)
				.get('/usuarios/recuperar/:token')
				.expect(200)
				.expect(function(response) {
					assert.notEqual(response.text.indexOf('Se ha producido un error en la recuperación de tu cuenta'), -1);
				})
				.end(done);
		});

		it('GET /usuarios/recuperar/:token - Vista nueva contraseña (fallo no existe usuario)', function (done) {
			var usuario_inexistente = {
				_id: "id_fake"
			}
			var token_usuario_inexistente = AuthController.crearToken(usuario_inexistente, 1);
			supertest(qualiteacher)
				.get('/usuarios/recuperar/' + token_usuario_inexistente)
				.expect(301)
				.expect(function (response) {
					assert.notEqual(response.text.indexOf('Redirecting to /'), -1);
				})
				.end(done);
		});

		it('GET /usuarios/recuperar/:token - Vista nueva contraseña (fallo token no concuerda con el del usuario)', function (done) {
			var token_modificado = AuthController.crearToken(usuario_creado, 2);
			supertest(qualiteacher)
				.get('/usuarios/recuperar/' + token_modificado)
				.expect(200)
				.expect(function(response) {
					assert.notEqual(response.text.indexOf('Se ha producido un error en la recuperación de tu cuenta'), -1);
				})
				.end(done);
		});

		it('GET /usuarios/recuperar/:token - Vista nueva contraseña (token correcto)', function (done) {
			supertest(qualiteacher)
				.get('/usuarios/recuperar/' + token_recuperacion)
				.expect(200)
				.expect(function(response) {
					assert.notEqual(response.text.indexOf('Qualiteacher | Recuperar contraseña'), -1);
				})
				.end(done);
		});

		it('GET /usuarios/contrasenya-cambiada - Vista contraseña cambiada correctamente', function (done) {
			supertest(qualiteacher)
				.get('/usuarios/contrasenya-cambiada')
				.expect(200)
				.expect(function (response){
					assert.notEqual(response.text.indexOf("¡Contraseña cambiada correctamente!"), -1);
				})
				.end(done)
		});

		it('POST /usuarios/nueva-contrasenya - Cambiar contraseña (token no válido)', function (done) {
			supertest(qualiteacher)
				.post('/usuarios/nueva-contrasenya')
				.send({
					token: token_recuperacion + "a",
					contrasenya: "testpass"
				})
				.expect(400, {error: 'El token ha expirado.'}, done);
		});

		it('POST /usuarios/nueva-contrasenya - Cambiar contraseña (token valido pero no existe usuario)', function (done) {
			var usuario_inexistente = {
				_id: "id_fake"
			}
			var token_usuario_inexistente = AuthController.crearToken(usuario_inexistente, 1);
			supertest(qualiteacher)
				.post('/usuarios/nueva-contrasenya')
				.send({
					token: token_usuario_inexistente,
					contrasenya: "testpass"
				})
				.expect(301)
				.expect(function (response) {
					assert.notEqual(response.text.indexOf('Redirecting to /'), -1);
				})
				.end(done);
		});

		it('POST /usuarios/nueva-contrasenya - Cambiar contraseña (no concuerda token)', function (done) {
			var token_modificado = AuthController.crearToken(usuario_creado, 2);

			supertest(qualiteacher)
				.post('/usuarios/nueva-contrasenya')
				.send({
					token: token_modificado,
					contrasenya: "testpass"
				})
				.expect(400, {error: 'El token no es válido.'}, done)
		});

		it('POST /usuarios/nueva-contrasenya - Cambiar contraseña (correcto)', function (done) {
			supertest(qualiteacher)
				.post('/usuarios/nueva-contrasenya')
				.send({
					token: token_recuperacion,
					contrasenya: "testpass"
				})
				.expect(200, {mensaje: 'Contraseña cambiada correctamente.'}, done)
		});
	});


	after(function (done) {
		Usuarios.findOneAndRemove({"nick": test_user.nickname}).exec(function(err) {

			if (err) done(err);
				done();
		});
	})

});