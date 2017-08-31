var supertest = require('supertest');
var assert = require('assert')
var qualiteacher = require('../app');
var mongoose = require('mongoose')
var Carreras = mongoose.model('Carreras');

describe('Suite Carreras', function () {

	var carrera;

	before(function(done) {
		carrera = new Carreras({
			_id : mongoose.Types.ObjectId() + "",
			nombre: "Ingenieria informática del TEST",
			codigo: "IG",
		});
		carrera.save(function (err) {
			if (err) done(err);
			done();
		})
	});

	after(function (done) {
		Carreras.remove({_id: carrera._id}, function (err) {

			if (err) done(err);
			done();
		})
	})

	it("GET - /:carrera - Vista carrera (error no existe)", function(done) {
		supertest(qualiteacher)
			.get('/carreras/'+carrera._id+"a")
			.expect(404)
			.expect(function (response) {
				assert.notEqual(response.text.indexOf("Esa carrera no existe"), -1);
			})
			.end(done);
	})

	it("GET - /:carrera - Vista carrera correcto", function(done) {
		supertest(qualiteacher)
			.get('/carreras/'+carrera._id)
			.expect(200)
			.expect(function (response) {
				assert.notEqual(response.text.indexOf(carrera.nombre), -1);
			})
			.end(done);
	})

	it("GET - /:carrera/datos - Json información carrera (Error no existe)", function(done) {
		supertest(qualiteacher)
			.get('/carreras/'+carrera._id+"a/datos")
			.expect(404, {error: "Esa carrera no existe"}, done)
	});

	it("GET - /:carrera/datos - Json información carrera correcto", function(done) {
		supertest(qualiteacher)
			.get('/carreras/'+carrera._id+"/datos")
			.expect(200)
			.expect(function (response) {
				var respuesta = JSON.parse(response.text)
				assert(respuesta .hasOwnProperty("_id"));
				assert.equal(respuesta ._id, carrera._id)
				assert.equal(respuesta .nombre, carrera.nombre)
				assert.equal(respuesta .codigo, carrera.codigo)
			})
			.end(done);
	})
});