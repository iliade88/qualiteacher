var faker = require("faker")
var chalk = require("chalk");
var mongoose = require('mongoose');
var Universidades = mongoose.model('Universidades');
var Carreras = mongoose.model('Carreras');
var Asignaturas = mongoose.model('Asignaturas');
var Profesores = mongoose.model('Profesores');
var Votos = mongoose.model('Votos');

function getRandomInt(min, max) {
	  return Math.floor(Math.random() * (max - min)) + min;
	}

function generaNombreGrado()
{
	var grados = [
		"Administración de Empresas",
		"Administración y Dirección ",
		"Administración y Gestión Pública",
		"Análisis Económico",
		"Animación Digital",
		"Antropología Social",
		"Antropología Social y Cultural",
		"Arqueología",
		"Arquitectura",
		"Arquitectura Naval",
		"Arte",
		"Arte Electrónico y Digital",
		"Artes Escénicas",
		"Artes Escénicas y Mediáticas",
		"Artes Escénicas-Interpretacón",
		"Artes Visuales y Danza",
		"Artes y Diseño",
		"Asistencia en Dirección ",
		"Astrofísica y Ciencias del espacio",
		"Audiovisual y Multimedia ",
		"Bellas Artes",
		"Biología ",
		"Biología Ambiental ",
		"Biologia Humana",
		"Biología Sanitaria",
		"Biomedicina Básica y Experimental",
		"Bioquímica",
		"Bioquímica y Biología Molecular",
		"Bioquímica y Ciencias Biométricas",
		"Biotecnología ",
		"Ciencia de la Arquitectura ",
		"Ciencia Política y Administrativa",
		"Ciencia Política y Gestión ",
		"Ciencia y Salud Animal",
		"Ciencia y Tecnología de los Alimentos",
		"Ciencias Ambientales ",
		"Ciencias Biomédicas",
		"Ciencias Criminológicas y de la Seguridad",
		"Ciencias de la Actividad Física",
		"Ciencias de la Alimentación",
		"Ciencias de la Cultura y Difusión cultural",
		"Ciencias de la Danza ",
		"Ciencias del Deporte",
		"Ciencias del Mar",
		"Ciencias del Trabajo",
		"Ciencias del Trabajo y Recursos Humanos",
		"Ciencias del Transporte y Logística",
		"Ciencias Económicas ",
		"Ciencias Empresariales",
		"Ciencias Experimentales",
		"Ciencias Inmobiliarias",
		"Ciencias Juridicas de las Administraciones",
		"Ciencias Médicas Básicas",
		"Ciencias Médicas Experimentales",
		"Ciencias Políticas",
		"Ciencias y Lenguas de la Antigüedad",
		"Cine",
		"Cine y Medios Audiovisuales",
		"Cine y Televisión",
		"Comercio",
		"Comercio Internacional",
		"Comercio y Marketing",
		"Composición de Músicas Contemporáneas",
		"Comunicación  ",
		"Comunicación Audiovisual",
		"Comunicación Cultural ",
		"Comunicación Publicitaria",
		"Comunicación y Periodismo",
		"Conservación y Restauración",
		"Contabilidad y Finanzas",
		"Creación Musical ",
		"Creación y Diseño",
		"Criminología",
		"Criminología y Seguridad ",
		"Derecho",
		"Dirección Comercial y Marketing",
		"Dirección de Empresas ",
		"Dirección y Administración ",
		"Diseño de Moda",
		"Diseño Multimedia y Gráfico",
		"Diseño Visual de Contenidos",
		"Diseño y Desarrollo de Videojuegos",
		"Economía",
		"Economía Financiera",
		"Economía Política",
		"Economía por la Universidad",
		"Economía y Finanzas",
		"Educación Infantil",
		"Educación Primaria",
		"Educación Social",
		"Empresa y Tecnología",
		"Enfermería",
		"Enología",
		"Estadística",
		"Estadística Aplicada",
		"Estadística Empresarial",
		"Estadística y Empresa",
		"Estudios Árabes e Islámicos",
		"Estudios Árabes y Hebreos",
		"Estudios Alemanes",
		"Estudios Clásicos",
		"Estudios de Asia Oriental ",
		"Estudios Franceses",
		"Estudios Francófonos Aplicados",
		"Estudios Hebreos y Arameos",
		"Estudios Hispánicos",
		"Estudios Hispánicos: Lengua",
		"Estudios Ingleses",
		"Estudios Italianos",
		"Estudios Vascos",
		"Farmacia",
		"Filología",
		"Filología Catalana",
		"Filología Clásica",
		"Filología Hispánica",
		"Filología Moderna. Inglés",
		"Filología Románica",
		"Filología Vasca",
		"Filosofía ",
		"Finanzas",
		"Finanzas y Contabilidad",
		"Finanzas y Seguros",
		"Finanzas, Banca y Seguros",
		"Fiscalidad y Administración",
		"Física",
		"Fisioterapia",
		"Fotografía",
		"Fotografía y Creación Digital",
		"Fundamentos de Arquitectura",
		"Gastronomía y Artes Culinarias",
		"Genética",
		"Geografía",
		"Graduado/a en Biotecnología",
		"Historia",
		"Historia del Arte",
		"Historia y Patrimonio",
		"Humanidades",
		"Igualdad de Género",
		"Información y Documentación",
		"Informática y Servicios",
		"Ingeniería Aeroespacial",
		"Ingeniería Agraria",
		"Ingeniería Agrícola",
		"Ingeniería Agroalimentaria",
		"Ingeniería Alimentaria",
		"Ingeniería Ambiental",
		"Ingeniería Biomédica",
		"Ingeniería Civil",
		"Ingeniería de Aeronavegación",
		"Ingeniería de Aeropuertos",
		"Ingeniería de Edificación",
		"Ingeniería de Materiales",
		"Ingeniería de Minas",
		"Ingeniería de Obras Pública",
		"Ingeniería de Organización",
		"Ingeniería del Automóvil",
		"Ingeniería del Software",
		"Ingeniería Eléctrica",
		"Ingeniería Electromécanica ",
		"Ingeniería Electrónica",
		"Ingeniería en Diseño Industrial",
		"Ingeniería en Sonido e Imagen",
		"Ingeniería en Vehículos Aereos",
		"Ingeniería Física",
		"Ingeniería Forestal",
		"Ingeniería Geológica",
		"Ingeniería Geomática y Topográfica",
		"Ingeniería Hortofrutícola",
		"Ingeniería Informática",
		"Ingeniería Marina",
		"Ingeniería Marítima",
		"Ingeniería Matemática",
		"Ingeniería Mecánica",
		"Ingeniería Mecatrónica",
		"Ingeniería Minera",
		"Ingeniería Multimedia",
		"Ingeniería Náutica ",
		"Ingeniería Química",
		"Ingeniería Radioelectrónica",
		"Ingeniería Técnica de Telecomunicaciónes",
		"Ingeniería Telemática",
		"Ingeniería y Ciencia Agronó",
		"Inteligencia y Desarrollos ",
		"Lengua Española y Literatur",
		"Lengua y Literatura Alemana",
		"Lengua y Literatura Catalan",
		"Lengua y Literatura Español",
		"Lengua y Literatura Gallega",
		"Lengua y Literatura Hispáni",
		"Lengua y Literatura Inglesa",
		"Lengua y Literatura Moderna",
		"Lenguas Aplicadas",
		"Lenguas Extranjeras",
		"Lenguas Modernas",
		"Liderazgo Emprendedor e Innovación",
		"Lingüística",
		"Literatura General",
		"Literaturas Comparadas",
		"Logopedia",
		"Magisterio de Educación Infantil",
		"Magisterio de Educación Primaria",
		"Marketing",
		"Matemática Computacional ",
		"Matemáticas",
		"Matemáticas e Informática",
		"Matemáticas y Estadística",
		"Medicina",
		"Medios Audiovisuales",
		"Microbiología ",
		"Multimedia",
		"Multimedia y Artes Digitales",
		"Musicología",
		"Nanociencia y Nanotecnología",
		"Negocios Internacionales",
		"Nutrición Humana y Dietétic",
		"Odontología",
		"Óptica y Optometría",
		"Organización Industrial",
		"Paisajismo",
		"Pedagogía",
		"Periodismo",
		"Piloto de Aviación Comercial",
		"Podología",
		"Psicología",
		"Publicidad",
		"Química",
		"Relaciones Internacionales",
		"Relaciones Laborales",
		"Sistemas de Información",
		"Sociología",
		"Terapia Ocupacional",
		"Trabajo Social",
		"Traducción",
		"Turismo",
		"Urbanismo, Ordenación Terri",
		"Veterinaria",
	];

	return grados[getRandomInt(0, grados.length)]
}

function generaProfesor()
{
	var randomName = faker.name.firstName() + " " + faker.name.lastName() + " " + faker.name.lastName();
		return {
		nombre: randomName,
		universidad: 0,
		asignaturas: new Array(),
		votos: new Array()
	}
}

function setUniversidadProfesor(profesor, universidad)
{
	profesor.universidad = universidad;
	profesor.save(function (err) { if (err) console.log(chalk.bold.red(err)); })
}

function appendAsignaturaAProfesor(profesor, asignatura)
{
	profesor.asignaturas.push(asignatura)
	profesor.save(function (err) { if (err) console.log(chalk.bold.red(err)); })
}

function appendVotoAProfesor(profesor, voto)
{
	profesor.votos.push(voto)
	profesor.save(function (err) { if (err) console.log(chalk.bold.red(err)); })
}

function generaAsignatura()
{
	var nombre = faker.company.bs()
	var codigo = "C"+faker.random.number(1000);

	return {
		nombre: nombre,
		codigo: codigo,
		universidad: 0,
		carrera: 0,
		profesores: new Array(),
	}
}

function setUniversidadAsignatura(asignatura, universidad)
{
	asignatura.universidad = universidad;
	asignatura.save(function (err) { if (err) console.log(chalk.bold.red(err)); })
}

function setCarreraAsignatura(asignatura, carrera)
{
	asignatura.carrera = carrera;
	asignatura.save(function (err) { if (err) console.log(chalk.bold.red(err)); })
}

function appendProfesorAsignatura(asignatura, profesor)
{
	asignatura.profesores.push(profesor)
	asignatura.save(function (err) { if (err) console.log(chalk.bold.red(err)); })
}

function generaCarrera()
{
	var nombre = generaNombreGrado();
	var codigo = "C"+faker.random.number(1000);

	return {
		nombre: nombre,
		codigo: codigo,
		asignaturas: new Array(),
		universidad: 0
	}
}

function appendAsignaturasCarrera(asignatura, carrera)
{
	carrera.asignaturas.push(asignatura);
	carrera.save(function (err) { if (err) console.log(chalk.bold.red(err)); })
}

function setUniversidadCarrera(carrera, universidad)
{
	carrera.universidad = universidad;
	carrera.save(function (err) { if (err) console.log(chalk.bold.red(err)); })
}

function appendProfesorAUniversidad(profesor, universidad)
{
	universidad.profesores.push(profesor)
	universidad.save(function (err) { if (err) console.log(chalk.bold.red(err)); })
}

function appendCarreraAUniversidad(carrera, universidad)
{
	universidad.carreras.push(carrera)
	universidad.save(function (err) { if (err) console.log(chalk.bold.red(err)); })
}

function generaVoto(profesor, asignatura)
{
	var cuestionario = new Array();

	for (var i = 0; i < 10; i++)
	{
		cuestionario.push(getRandomInt(0, 10));
	}

	return {
		cuestionario: cuestionario,
		profesor: profesor,
		asignatura: asignatura
	}
}

function generaVotos(profesor, asignatura)
{
	var numvotos = getRandomInt(1, 5);

	for (var i = 0; i < numvotos; i++)
	{
		var voto = new Votos(generaVoto(profesor._id, asignatura._id));

		voto.save(function (err, votoGuardado) {
			if (err) console.log(chalk.bold.red(err));
			console.log("Generando votos para el profesor : "+chalk.bold.yellow(profesor.nombre) + " de la asignatura: "+chalk.bold.magenta(asignatura.nombre))
			appendVotoAProfesor(profesor, votoGuardado._id)	
		})
	}
}

function generaDatosAsignatura(asignatura, carrera, universidad)
{
	var num_profesores_asignatura = getRandomInt(2, 6);

	for (var k = 0; k < num_profesores_asignatura; k++)
	{
		var profesor = new Profesores(generaProfesor());

		setUniversidadProfesor(profesor, universidad._id)
		appendAsignaturaAProfesor(profesor, asignatura._id)

		profesor.save(function(err, profesorGuardado)
		{
			if (err) console.log(chalk.bold.red(err))

			console.log("Generando datos para el profesor : "+chalk.bold.yellow(profesorGuardado.nombre) + " de la asignatura: "+chalk.bold.magenta(asignatura.nombre) + "de la carrera: "+chalk.bold.green(carrera.nombre) + " de la universidad "+chalk.bold.cyan(universidad.nombre))
			generaVotos(profesorGuardado, asignatura);

			appendProfesorAsignatura(asignatura, profesorGuardado._id);
		})
	}
}

function generaDatosCarrera(carrera, universidad)
{
	var num_asignaturas_carrera = getRandomInt(3, 6);
	var asignaturas = [];
	var profesores = [];

	for (var i = 0; i < num_asignaturas_carrera; i++)
	{
		var asignatura = new Asignaturas(generaAsignatura());
		setCarreraAsignatura(asignatura, carrera._id)
		setUniversidadAsignatura(asignatura, universidad._id)

		asignatura.save(function(err, asignaturaGuardada)
		{
			console.log("Generando datos para la asignatura: "+chalk.bold.magenta(asignaturaGuardada.nombre) + "de la carrera: "+chalk.bold.green(carrera.nombre) + " de la universidad "+chalk.bold.cyan(universidad.nombre))
			generaDatosAsignatura(asignaturaGuardada, carrera, universidad)	
		})
		
		appendAsignaturasCarrera(asignatura._id, carrera)
		asignaturas.push(asignatura)
	}
}

exports.generaDatosUniversidad = function(universidad)
{
	var num_carreras = getRandomInt(4, 8);
	
	for (var i = 0; i < num_carreras; i++)
	{
		var carrera = new Carreras(generaCarrera());
		setUniversidadCarrera(carrera, universidad._id)

		carrera.save(function(err, carreraGuardada)
		{
			if (err) console.log(chalk.bold.red(err));

			console.log("Generando datos para la carrera: "+chalk.bold.green(carreraGuardada.nombre) + " de la universidad "+chalk.bold.cyan(universidad.nombre))
			generaDatosCarrera(carreraGuardada, universidad);
			appendCarreraAUniversidad(carreraGuardada._id, universidad);
		})		
	}
}