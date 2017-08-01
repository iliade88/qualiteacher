#!/usr/bin/env node
var mongoose = require('mongoose');
var faker = require("faker");
var chalk = require("chalk");

mongoose.connect('mongodb://localhost/qualiteacher');
require('./models/Universidades');
require('./models/Usuarios');
require('./models/Profesores');
require('./models/Asignaturas');
require('./models/Carreras');
require('./models/Votos');

var fakerQualiteacher = require('./fakerQualiteacher.js');
var Universidades = mongoose.model('Universidades');
var Carreras = mongoose.model('Carreras');
var Asignaturas = mongoose.model('Asignaturas');
var Profesores = mongoose.model('Profesores');
var Votos = mongoose.model('Votos');

console.log("Bienvenido al generado de datos para Qualiteacher")
Universidades.find(function(err, universidades) {
	if(err) console.log(err.message);

	for (var i in universidades)
	{
		console.log("Generando datos para la universidad: "+chalk.bold.cyan(universidades[i].nombre))
		fakerQualiteacher.generaDatosUniversidad(universidades[i])
	}
});
console.log("Fin del proceso. Hasta luego! :)")