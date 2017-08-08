#!/usr/bin/env node
var mongoose = require('mongoose');
var chalk = require("chalk");
var fs = require('fs');
var observe = require('observe')
const {spawn} = require('child_process');

mongoose.connect('mongodb://localhost/qualiteacher');
require('./models/Universidades');
require('./models/Profesores');
require('./models/Asignaturas');
require('./models/Carreras');

var fakerQualiteacher = require('./fakerQualiteacher.js');
var Universidades = mongoose.model('Universidades');
var importstatus = {
	fin_unis: false,
	fin_carreras: false,
	fin_asignaturas: false,
	fin_profesores: false
};

var observer = observe(importstatus);

observer.on('change', function (change)
{
	if (observer.subject.fin_unis == true && observer.subject.fin_carreras == true && observer.subject.fin_asignaturas == true && observer.subject.fin_profesores == true)
	{
		process.exit(0);
	}
});

function convierteObjetosAJsonUnoPorLinea(objetos)
{
	var json = "";

	console.log(chalk.bold.red(objetos.length))
	for (var i = 0; i < objetos.length; i++)
	{
		json += JSON.stringify(objetos[i])

		if (i < (objetos.length - 1))
		{
			json += "\r\n"
		}
	}
	return json;
}

function generaDatos(universidades)
{
	var datos_generados;

	datos_generados = fakerQualiteacher.generaDatosUniversidades(universidades);

	var datos_universidades_json = convierteObjetosAJsonUnoPorLinea(datos_generados.datos_universidades);
	var datos_carreras_json = convierteObjetosAJsonUnoPorLinea(datos_generados.datos_carreras);
	var datos_asignaturas_json = convierteObjetosAJsonUnoPorLinea(datos_generados.datos_asignaturas);
	var datos_profesores_json = convierteObjetosAJsonUnoPorLinea(datos_generados.datos_profesores);

	try
	{
		fs.writeFileSync('./QualiteacherUniversidades.json', datos_universidades_json);

		const mongoimport_universidades= spawn('mongoimport', ['--db', 'qualiteacher', '--collection', 'universidades', '--drop', '--type' , 'json', '--file', './QualiteacherUniversidades.json']);

		mongoimport_universidades.stdout.on('data', (data) => {
			console.log(chalk.bold.green('Resultado importacion universidades'));
		});

		mongoimport_universidades.stderr.on('data', (data) => {
			console.log(`stderr: ${data}`);
		});

		mongoimport_universidades.on('close', (code) => {
			observer.set('fin_unis', true)
			console.log(`Fin importacion universidades ${code}`);
		});
	}
	catch (err)
	{
		if (err) console.log(chalk.bold.red(err));
	}
	finally
	{
		console.log("Guardado el JSON de universidades :)")
	};

	try
	{
		fs.writeFileSync('./QualiteacherCarreras.json', datos_carreras_json);

		const mongoimport_carreras= spawn('mongoimport', ['--db', 'qualiteacher', '--collection', 'carreras', '--drop', '--type' , 'json', '--file', './QualiteacherCarreras.json']);

		mongoimport_carreras.stdout.on('data', (data) => {
			console.log(chalk.bold.yellow('Resultado importacion carreras'));
			console.log(chalk.bold.yellow(`stdout: ${data}`));
		});

		mongoimport_carreras.stderr.on('data', (data) => {
			console.log(`stderr: ${data}`);
		});

		mongoimport_carreras.on('close', (code) => {
			observer.set('fin_carreras', true)
			console.log(`Finalizada importación carreras ${code}`);
		});

	}
	catch (err)
	{
		if (err) console.log(chalk.bold.red(err));
	}
	finally
	{
		console.log("Guardado el JSON de carreras :)")
	};

	try
	{
		fs.writeFileSync('./QualiteacherAsignaturas.json', datos_asignaturas_json);

		const mongoimport_asignaturas= spawn('mongoimport', ['--db', 'qualiteacher', '--collection', 'asignaturas', '--drop', '--type' , 'json', '--file', './QualiteacherAsignaturas.json']);

		mongoimport_asignaturas.stdout.on('data', (data) => {
			console.log(chalk.bold.cyan('Resultado importacion asignaturas'));
			console.log(chalk.bold.cyan(`stdout: ${data}`));
		});

			mongoimport_asignaturas.stderr.on('data', (data) => {
			console.log(`stderr: ${data}`);
		});

		mongoimport_asignaturas.on('close', (code) => {
			observer.set('fin_asignaturas', true)
			console.log(`Finalizada importacion asignaturas ${code}`);
		});

	}
	catch (err)
	{
		if (err) console.log(chalk.bold.red(err));
	}
	finally
	{
		console.log("Guardado el JSON de asignaturas :)")
	};

	try
	{
		fs.writeFileSync('./QualiteacherProfesores.json', datos_profesores_json);

		const mongoimport_profesores= spawn('mongoimport', ['--db', 'qualiteacher', '--collection', 'profesores', '--drop', '--type' , 'json', '--file', './QualiteacherProfesores.json']);

		mongoimport_profesores.stdout.on('data', (data) => {
			console.log(chalk.bold.magenta('Resultado importacion asignaturas'));
			console.log(chalk.bold.magenta(`stdout: ${data}`));
		});

		mongoimport_profesores.stderr.on('data', (data) => {
			console.log(`stderr: ${data}`);
		});

		mongoimport_profesores.on('close', (code) => {
			observer.set('fin_profesores', true)
			console.log(`Finalizada importacion profesores ${code}`);
		});

	}
	catch (err)
	{
		if (err) console.log(chalk.bold.red(err));
	}
	finally
	{
		console.log("Guardado el JSON de profesores :)")
	};
}

Universidades
	.find()
	.exec(function (err, universidades)
	{
		if (err) console.log(chalk.bold.red(err));

		console.log("Bienvenido al generador de datos para Qualiteacher");
		generaDatos(universidades);
	});
