var supertest = require('supertest');
var assert = require("assert");
var qualiteacher = require('../app');
var mongoose = require('mongoose')
var Universidades = mongoose.model('Universidades');


describe('Suite Universidades', function () {

	var universidad;
	before(function(done) {
		universidad = new Universidades({
			_id : mongoose.Types.ObjectId() + "",
			nombre: "Universidad del TEST",
			comunidad: "Comunidad Testónoma"
		});

		universidad.save(function(err){
			if (err) done(err)
			done();
		})
	})

	after(function(done){
		Universidades.remove({_id: universidad._id}, function (err) {
			if (err) done(err);
			done();
		})
	});

	it('GET /universidades/:id - Vista detalle universidad (error inexistente)', function (done) {
		supertest(qualiteacher)
			.get('/universidades/'+universidad._id+"a")
			.expect(404)
			.expect(function (response) {
				assert.notEqual(response.text.indexOf('Esa universidad no existe'), -1);
			})
			.end(done)
	});

	it('GET /universidades/:id - Vista detalle universidad correcta', function (done) {
		supertest(qualiteacher)
			.get('/universidades/'+universidad._id)
			.expect(200)
			.expect(function (response) {
				assert.notEqual(response.text.indexOf(universidad.nombre), -1);
			})
			.end(done)
	});
});