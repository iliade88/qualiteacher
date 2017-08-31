var supertest = require('supertest');
var assert = require('assert')
var qualiteacher = require('../app');
var mongoose = require('mongoose')
var Universidades = mongoose.model('Universidades');
var Carreras = mongoose.model('Carreras');
var Asignaturas = mongoose.model('Asignaturas');

describe('Suite Asignaturas', function () {

	var universidad, carrera, asignatura;

	before(function(done) {
		universidad = new Universidades({
			_id : mongoose.Types.ObjectId() + "",
			nombre: "Universidad del TEST",
			comunidad: "Comunidad Testónoma"
		});
		carrera = new Carreras({
			_id : mongoose.Types.ObjectId() + "",
			nombre: "Ingenieria informática del TEST",
			codigo: "IG",
		});
		asignatura = new Asignaturas({
			_id : mongoose.Types.ObjectId() + "",
			nombre: "Planificacion y Pruebas de Sistemas Software del TEST",
			codigo: "PPSS",
			universidad: universidad._id
		});

		universidad["carreras"] = [carrera._id]
		carrera["asignaturas"] =  [asignatura._id]
		carrera["universidad"] =  universidad._id
		asignatura["carrera"] =  carrera._id

		universidad.save(function (err) {
			if (err) done(err);

			carrera.save(function (err) {
				if (err) done(err)

				asignatura.save(function (err) {
					if (err) done(err)

					done();
				})
			})
		})
	});

	after(function (done) {
		Universidades.remove({id: universidad._id}, function (err) {

			Carreras.remove({id: carrera._id}, function (err) {

				Asignaturas.remove({id: asignatura._id}, function (err) {

					if (err) done(err);
					done();
				})
				if (err) done(err);
			})
			if (err) done(err);
		})
	})

	it("GET - /asignaturas/:id - Error asignatura no existe", function(done) {
		supertest(qualiteacher)
			.get('/asignaturas/'+asignatura._id+"a")
			.expect(404)
			.expect(function (response) {
				assert.notEqual(response.text.indexOf("Esa asignatura no existe"), -1);
			})
			.end(done);
	})

	it("GET - /asignaturas/:id - Asignatura existe", function(done) {
		supertest(qualiteacher)
			.get('/asignaturas/'+asignatura._id)
			.expect(200)
			.expect(function (response) {
				assert.notEqual(response.text.indexOf("Planificacion y Pruebas de Sistemas Software"), -1);
			})
			.end(done);
	})
});