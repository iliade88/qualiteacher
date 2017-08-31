var supertest = require('supertest');
var qualiteacher = require('../app');

describe('Suite General', function (done) {
	it('Muestra página principal', function (){
		supertest(qualiteacher)
			.get('/')
			.expect(200)
			.expect('Encuentra tu universidad, carrera, asignatura o profesor', done);
	});

	it('Buscador con cadena existente', function (){

	});

	it('Buscador con cadena inexistente', function () {

	});

	it('Muesta página registro', function () {

	});

	it('Muestra página registro completado', function () {

	});
});