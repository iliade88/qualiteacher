"use strict";

var supertest = require('supertest');
var assert = require('assert')
var qualiteacher = require('../app');
var mongoose = require('mongoose')
var Profesores = mongoose.model('Profesores');
var Asignaturas = mongoose.model('Asignaturas');
var Carreras = mongoose.model('Carreras');
var Universidades = mongoose.model('Universidades');
var Usuarios = mongoose.model('Usuarios')
var UtilsController = require('../controllers/UtilsController')
var AuthController = require('../controllers/AuthController')

describe('Suite Profesores', function () {

	var universidad, carrera, asignatura, asignatura_dos, profesor_test, test_user;

	before(function(done) {
		universidad = new Universidades({
			_id : mongoose.Types.ObjectId() + "",
			nombre: "Universidad del TEST",
			comunidad: "Comunidad Testónoma",
			nota: 0,
			num_votos: 0
		});
		carrera = new Carreras({
			_id : mongoose.Types.ObjectId() + "",
			nombre: "Ingenieria informática del TEST",
			codigo: "IG del TEST",
			nota: 0,
			num_notas_pp: UtilsController.generaMatrizRecuentoNotasPorPregunta(),
			num_votos: 0,
			universidad: universidad._id
		});
		asignatura = new Asignaturas({
			_id : mongoose.Types.ObjectId() + "",
			nombre: "Planificacion y Pruebas de Sistemas Software del TEST",
			codigo: "PPSS del TEST",
			universidad: universidad._id,
			nota: 0,
			num_notas_pp: UtilsController.generaMatrizRecuentoNotasPorPregunta(),
			num_votos: 0,
			carrera: carrera._id
		});
		asignatura_dos = new Asignaturas({
			_id : mongoose.Types.ObjectId() + "",
			nombre: "Aplicaciones Distribudas en Internet del TEST",
			codigo: "ADI del TEST",
			universidad: universidad._id,
			nota: 0,
			num_notas_pp: UtilsController.generaMatrizRecuentoNotasPorPregunta(),
			num_votos: 0,
			carrera: carrera._id
		});
		profesor_test = new Profesores({
			_id : mongoose.Types.ObjectId() + "",
			nombre: "ProfesorTest",
			nota: 0,
			num_notas_pp: UtilsController.generaMatrizRecuentoNotasPorPregunta(),
			num_votos: 0,
			notas_asignaturas_prof: [
				{
					asignatura : asignatura._id,
					nota_asignatura: 0,
					num_notas_pp: UtilsController.generaMatrizRecuentoNotasPorPregunta(),
					num_votos: 0
				},
				{
					asignatura : asignatura_dos._id,
					nota_asignatura: 0,
					num_notas_pp: UtilsController.generaMatrizRecuentoNotasPorPregunta(),
					num_votos: 0
				}
			],
			universidad: universidad._id
		});

		test_user = new Usuarios({
			_id : mongoose.Types.ObjectId() + "",
			nick: "test_user",
			email: "test_user_qualiteacher@alu.ua.es",
			contrasenya: "testing_simulator",
			universidad: universidad._id
		});

		universidad["carreras"] = [carrera._id]
		universidad["profesores"] = [profesor_test._id]
		carrera["asignaturas"] =  [asignatura._id, asignatura_dos._id]
		asignatura["profesores"] =  [profesor_test._id]
		asignatura_dos["profesores"] =  [profesor_test._id]
		test_user["token"] = AuthController.crearToken(test_user._id, 1);

		universidad.save(function (err) {
			if (err) done(err);

			carrera.save(function (err) {
				if (err) done(err);

				asignatura.save(function (err) {
					if (err) done(err);

					asignatura_dos.save(function (err) {
						if (err) done(err);

						profesor_test.save(function(err){
							if (err) done(err);

							test_user.save(function(err) {
								if (err) done(err);

								done();
							})
						})
					})
				})
			})
		})
	});

	after(function (done) {
		Universidades.remove({_id: universidad._id}, function (err) {

			Carreras.remove({_id: carrera._id}, function (err) {

				Asignaturas.remove({_id: asignatura._id}, function (err) {

					Asignaturas.remove({_id: asignatura_dos._id}, function (err) {

						Profesores.remove({_id: profesor_test._id}, function (err) {

							Usuarios.remove({_id: test_user._id}, function (err) {
								if (err) done(err);

								done();
							})
							if (err) done(err);
						})
						if (err) done(err);
					})
					if (err) done(err);
				})
				if (err) done(err);
			})
			if (err) done(err);
		})
	});

	it("GET /profesores/:id - Vista detalle profesor (Error profesor no existe)", function (done) {
		supertest(qualiteacher)
			.get("/profesores/"+profesor_test._id+"a")
			.expect(404)
			.expect(function(response) {
				assert.notEqual(response.text.indexOf("Ese profesor no existe"), -1)
			})
			.end(done)
	})

	it("GET /profesores/:id - Vista detalle profesor correcto", function (done) {
		supertest(qualiteacher)
			.get("/profesores/"+profesor_test._id)
			.expect(200)
			.expect(function(response) {
				assert.notEqual(response.text.indexOf(profesor_test.nombre), -1)
			})
			.end(done)
	})

	it("GET /profesores/:id/calificar - Vista calificar profesor (Error profesor no existe)", function (done) {
		supertest(qualiteacher)
			.get("/profesores/"+profesor_test._id+"a/calificar")
			.expect(404)
			.expect(function(response) {
				assert.notEqual(response.text.indexOf("Ese profesor no existe"), -1)
			})
			.end(done)
	})

	it("GET /profesores/:id/calificar - Vista calificar profesor correcto", function (done) {
		supertest(qualiteacher)
			.get("/profesores/"+profesor_test._id+"/calificar")
			.expect(200)
			.expect(function(response) {
				assert.notEqual(response.text.indexOf("Encuesta de calidad de"), -1)
				assert.notEqual(response.text.indexOf("ProfesorTest"), -1)
			})
			.end(done)
	})

	it('POST /:profesor/:asignatura/calificar - Accion de calificar a un profesor (Error usuario no autenticado)', function(done) {
		supertest(qualiteacher)
			.get("/profesores/"+profesor_test._id+"/calificar")
			.expect(403, {error: "Tu petición no tiene cabecera de autorización"}, done)
	})

	it('POST /:profesor/:asignatura/calificar - Accion de calificar a un profesor (Error profesor no existe)', function(done) {
		supertest(qualiteacher)
			.post("/profesores/"+profesor_test._id+"a/"+asignatura._id+"/calificar")
			.set('Authorization', 'Bearer '+test_user.token)
			.send({
				pr1: 0,
				pr2: 8,
				pr3: 2,
				pr4: 8,
				pr5: 4,
				pr6: 2,
				pr7: 6,
				pr8: 5,
				pr9: 8,
				pr10: 9
			})
			.expect(400, {error: "Ese profesor no existe"}, done)
	})

	it('POST /:profesor/:asignatura/calificar - Accion de calificar a un profesor (Error asignatura no existe)', function(done) {
		supertest(qualiteacher)
			.post("/profesores/"+profesor_test._id+"/"+asignatura._id+"a/calificar")
			.set('Authorization', 'Bearer '+test_user.token)
			.send({
				pr1: 0,
				pr2: 8,
				pr3: 2,
				pr4: 8,
				pr5: 4,
				pr6: 2,
				pr7: 6,
				pr8: 5,
				pr9: 8,
				pr10: 9
			})
			.expect(400, {error: "Esa asignatura no existe"}, done)
	})

	it('POST /:profesor/:asignatura/calificar - Accion de calificar a un profesor (Error el profesor no imparte esa asignatura)', function(done) {
		supertest(qualiteacher)
			.post("/profesores/"+profesor_test._id+"/"+asignatura._id+"/calificar")
			.set('Authorization', 'Bearer '+test_user.token)
			.send({
				pr1: 0,
				pr2: 8,
				pr3: 2,
				pr4: 8,
				pr5: 4,
				pr6: 2,
				pr7: 6,
				pr8: 5,
				pr9: 8,
				pr10: 9
			})
			.expect(400, {error: "Ese profesor no imparte esa asignatura"}, done)
	})

	it('POST /:profesor/:asignatura/calificar - Accion de calificar a un profesor acción correcta y votado 2 veces', function(done) {

		supertest(qualiteacher)
			.post("/profesores/"+profesor_test._id+"/"+asignatura._id+"/calificar")
			.set('Authorization', 'Bearer '+test_user.token)
			.send({
				pr1: 0,
				pr2: 8,
				pr3: 2,
				pr4: 8,
				pr5: 4,
				pr6: 2,
				pr7: 6,
				pr8: 5,
				pr9: 8,
				pr10: 9
			})
			.expect(200, {})
			.then(function () {
				supertest(qualiteacher)
					.post("/profesores/"+profesor_test._id+"/"+asignatura_dos._id+"/calificar")
					.set('Authorization', 'Bearer '+test_user.token)
					.send({
						pr1: 10,
						pr2: 9,
						pr3: 4,
						pr4: 7,
						pr5: 6,
						pr6: 5,
						pr7: 4,
						pr8: 8,
						pr9: 2,
						pr10: 10
					})
					.expect(200, {})
					.then(function () {
						Profesores.findOne({_id: profesor_test._id}, function (err, prof) {

							assert.equal(prof.nota, 5.85);
							assert.equal(prof.num_votos, 2);
							assert.equal(prof.notas_asignaturas_prof.length, 2)
							assert.equal(prof.notas_asignaturas_prof[0].nota_asignatura, 5.20)
							assert.equal(prof.notas_asignaturas_prof[0].num_votos, 1)
							assert.equal(prof.notas_asignaturas_prof[1].nota_asignatura, 6.50)
							assert.equal(prof.notas_asignaturas_prof[1].num_votos, 1)
							done();
						});
					});
			});
	});
});