var supertest = require('supertest');
var assert = require("assert")
var qualiteacher = require('../app');

describe('Suite General', function () {
	it('Muestra página principal', function (done){
		supertest(qualiteacher)
			.get('/')
			.expect(200)
			.expect(function(response) {
				assert.notEqual(response.text.indexOf('Encuentra tu universidad, carrera, asignatura o profesor'), -1)
			})
			.end(done);
	});

	it('Buscador con cadena inexistente', function (done) {
		supertest(qualiteacher)
			.get('/buscar/'+"cadenadetestqueesinexistenteenel100porciendeloscasos")
			.expect(200, { universidades: [], carreras: [], asignaturas: [], profesores: []}, done)
	});

	it('Buscador con cadena existente', function (done){
		supertest(qualiteacher)
			.get('/buscar/'+"Universidad%20de%20Alicante")
			.expect(200)
			.expect(function(response) {
				assert.notEqual(response.text.indexOf("Universidad de Alicante"), -1)
			})
			.end(done)
	});

	/* Muestra la vista de registro */
	exports.registro = function(req, res) {
		res.render('registro', {title : 'Qualiteacher | Registro'});
	}

	/* Muestra la vista de registro completado */
	exports.registroFinalizado = function(req, res) {
		res.render('registroCompletado', {title : 'Qualiteacher | Registro completado'});
	}
	it('Login', function (done) {
		supertest(qualiteacher)
			.get('/login/')
			.expect(200)
			.expect(function (response) {
				assert.notEqual(response.text.indexOf('<form name="formLogin" ng-submit="login()" class="form-horizontal text-center">'), -1);
				assert.notEqual(response.text.indexOf("Login"), -1);
				assert.notEqual(response.text.indexOf("Nombre de usuario"), -1);
			})
			.end(done)
	});

	it('Muesta página registro', function (done) {
		supertest(qualiteacher)
			.get('/registro/')
			.expect(200)
			.expect(function (response) {
				assert.notEqual(response.text.indexOf('<form name="formRegistro" ng-submit="formRegistro.$valid && submitForm(formData)" novalidate'), -1);
				assert.notEqual(response.text.indexOf("Registro"), -1);
			})
			.end(done)
	});

	it('Muestra página registro completado', function (done) {
		supertest(qualiteacher)
			.get('/registro-completado/')
			.expect(200)
			.expect(function (response) {
				assert.notEqual(response.text.indexOf('<h3>¡Registro completado!</h3>'), -1);
			})
			.end(done)
	});
});