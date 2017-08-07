var faker = require("faker")
var chalk = require("chalk");
var mongoose = require('mongoose');

faker.locale = "es";

var Universidades = mongoose.model('Universidades');
var Carreras = mongoose.model('Carreras');
var Asignaturas = mongoose.model('Asignaturas');
var Profesores = mongoose.model('Profesores');

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

function generaMatrizRecuentoNotasPorPregunta()
{
	var recuento_notas_por_pregunta = [10];
	//Inicializamos el array a 0
	for (var i = 0; i < 10; i++)
	{
		recuento_notas_por_pregunta[i] = new Array(11);

		for (var j = 0; j <= 10; j ++)
		{
			recuento_notas_por_pregunta[i][j] = 0;
		}
	}

	return recuento_notas_por_pregunta;
}

function generaProfesor(universidad)
{
	var randomName = faker.name.firstName() + " " + faker.name.lastName() + " " + faker.name.lastName();

	return {
		_id: mongoose.Types.ObjectId(),
		nombre: randomName,
		nota: 0,
		num_notas_pp: generaMatrizRecuentoNotasPorPregunta(),
		num_votos: 0,
		notas_asignaturas_prof: new Array(),
		universidad: universidad
	}
}

function generaAsignatura(universidad, carrera)
{
	return {
		_id: mongoose.Types.ObjectId(),
		nombre: faker.company.bs(),
		codigo: "C"+faker.random.number(1000),
		descripcion: faker.lorem.sentences(),
		nota: 0,
		num_notas_pp: generaMatrizRecuentoNotasPorPregunta(),
		num_votos: 0,
		universidad: universidad,
		carrera: carrera,
		profesores: []
	}
}

function generaCarrera(universidad)
{
	var nombre = generaNombreGrado();
	var codigo = "C"+faker.random.number(1000);

	return {
		_id: mongoose.Types.ObjectId(),
		nombre: nombre,
		codigo: codigo,
		nota: 0,
		num_notas_pp: generaMatrizRecuentoNotasPorPregunta(),
		num_votos: 0,
		asignaturas: new Array(),
		universidad: universidad
	}
}

function sumaVotoANumNotasPP(num_notas_pp, num_votos, calificacion)
{
	for (var i = 0; i < calificacion.length; i++)
	{
		var nota_pregunta = calificacion[i];
		num_notas_pp[i][nota_pregunta]++;
	}

	return num_votos + 1;
}

function recalculaNota(num_notas_pp, num_votos)
{
	var nota = 0;

	for (var i = 0; i < num_notas_pp.length; i++)
	{
		var suma_pregunta = 0;
		for (var j = 0; j < num_notas_pp[i].length; j++)
		{
			suma_pregunta += (num_notas_pp[i][j] * j) / num_votos;
		}

		nota += (suma_pregunta / 10);
	}

	return nota;
};


function buscaAsignatura(array, id_asignatura)
{
	for (var i = 0; i < array.length; i++)
	{
		if (""+array[i].asignatura === ""+id_asignatura) return i;
	}
	return -1;
}

function generaVotoProfesor(profesor, asignatura)
{
	var num_votos_asignatura = getRandomInt(1, 4);

	for (var i = 0; i < num_votos_asignatura; i++)
	{
		var calificacion = new Array(10);

		for (var j = 0; j < 10; j++)
		{
			calificacion[j] = getRandomInt(0, 10);
		}

		var indice_asignatura = buscaAsignatura(profesor.notas_asignaturas_prof, asignatura._id);
		if (indice_asignatura === -1)
		{
			var voto = {
				asignatura : asignatura._id,
				nota_asignatura: 0,
				num_notas_pp: generaMatrizRecuentoNotasPorPregunta(),
				num_votos: 0
			};

			voto.num_votos = sumaVotoANumNotasPP(voto.num_notas_pp, voto.num_votos, calificacion);
			voto.nota_asignatura = recalculaNota(voto.num_notas_pp, voto.num_votos);
			profesor.notas_asignaturas_prof.push(voto)
		}
		else
		{
			profesor.notas_asignaturas_prof[indice_asignatura].num_votos = sumaVotoANumNotasPP(profesor.notas_asignaturas_prof[indice_asignatura].num_notas_pp, profesor.notas_asignaturas_prof[indice_asignatura].num_votos, calificacion);
			profesor.notas_asignaturas_prof[indice_asignatura].nota_asignatura = recalculaNota(profesor.notas_asignaturas_prof[indice_asignatura].num_notas_pp, profesor.notas_asignaturas_prof[indice_asignatura].num_votos);
		}
		recalculaNotas(profesor, calificacion)
	}

	recalculaNotas(asignatura, calificacion);
}

function recalculaNotas(obj, calificacion)
{
	obj.num_votos = sumaVotoANumNotasPP(obj.num_notas_pp, obj.num_votos, calificacion);
	obj.nota = recalculaNota(obj.num_notas_pp, obj.num_votos);
}

function addNumNotasPP(num_notas_pp, num_votos, num_notas_pp_add, num_votos_add)
{
	for (var i = 0; i < num_notas_pp.length; i++)
	{
		for (var j = 0; j < num_notas_pp[i].length; j++)
		{
			num_notas_pp[i][j] += num_notas_pp_add[i][j];
		}
	}
	return num_votos + num_votos_add
}

function recalculaNota(num_notas_pp, num_votos)
{
	var nota = 0;

	for (var i = 0; i < num_notas_pp.length; i++)
	{
		var suma_pregunta = 0;
		for (var j = 0; j < num_notas_pp[i].length; j++)
		{
			suma_pregunta += (num_notas_pp[i][j] * j) / num_votos;
		}

		nota += (suma_pregunta / 10);
	}

	return nota;
};

function recalculaNotasCarrera(carrera, asignaturas_carrera)
{
	for (var i = 0; i < asignaturas_carrera.length; i++)
		carrera.num_votos = addNumNotasPP(carrera.num_notas_pp, carrera.num_votos, asignaturas_carrera[i].num_notas_pp, asignaturas_carrera[i].num_votos)

	carrera.nota = recalculaNota(carrera.num_notas_pp, carrera.num_votos);
}

function buscarProfesorAsignatura(asignatura, id_profesor)
{
	for (var i = 0; i < asignatura.profesores.length; i++)
	{
		if (asignatura.profesores[i]._id == id_profesor)
			return i;
	}
	return -1
}

function generaDatosCarrera(carrera, universidad, datos_asignaturas, datos_profesores)
{
	var num_asignaturas_carrera = getRandomInt(3, 6);
	var num_profesores_carrera = getRandomInt(10, 15);
	var asignaturas_carrera = [];
	var profesores_carrera = [];

	//Generamos los n profesores
	for (var i = 0; i < num_profesores_carrera; i++)
	{
		var profesor = generaProfesor(universidad._id);

		universidad.profesores.push(profesor._id);
		profesores_carrera.push(profesor);
	}

	for (var i = 0; i < num_asignaturas_carrera; i++)
	{
		var asignatura = generaAsignatura(carrera._id, universidad._id);

		carrera.asignaturas.push(asignatura._id);
		asignaturas_carrera.push(asignatura);
	}

	for (var i = 0; i < num_asignaturas_carrera; i++)
	{
		var num_profesores_asignatura = getRandomInt(1, 4);

		for (var j = 0; j < num_profesores_asignatura; j++)
		{
			var ind_profesor = getRandomInt(0, (num_profesores_carrera - 1));

			if (buscarProfesorAsignatura(asignaturas_carrera[i], profesores_carrera[ind_profesor]) === -1)
			{
				generaVotoProfesor(profesores_carrera[ind_profesor], asignaturas_carrera[i]);
				asignaturas_carrera[i].profesores.push(profesores_carrera[ind_profesor]._id);
			}
			else
				j--;
		}
	}

	asignaturas_carrera.forEach(function (asignatura) {
		datos_asignaturas.push(asignatura)
	});

	profesores_carrera.forEach(function (profesor) {
		datos_profesores.push(profesor);
	});

	recalculaNotasCarrera(carrera, asignaturas_carrera);
}

function calculaNotaUniversidad(universidad, carreras)
{
	var nota = 0;

	for (var i = 0; i < carreras.length; i++)
	{
		nota += carreras[i].nota;
		universidad.num_votos += carreras[i].num_votos
	}

	universidad.nota = nota / carreras.length;
}

exports.generaDatosUniversidades = function(universidades)
{
	var datos_universidades = [];
	var datos_carreras = [];
	var datos_asignaturas = [];
	var datos_profesores = [];

	console.log("GeneraDatosUniversidades para "+chalk.inverse.yellow(universidades.length)+" universidades");
	for (var i = 0; i < universidades.length; i++) {

		var universidad = universidades[i];
		var datos_carreras_universidad = [];

		universidad.nota = 0;
		universidad.num_votos = 0;

		var num_carreras = getRandomInt(4, 8);
		console.log(chalk.bold.green("UNIVERSIDADES:" + i + " - " + universidad.nombre));

		for (var j = 0; j < num_carreras; j++)
		{
			var carrera = generaCarrera(universidad._id);
			universidad.carreras.push(carrera._id);

			console.log("Generando datos para la carrera: "+chalk.bold.green(carrera.nombre) + " de la universidad "+chalk.bold.cyan(universidad.nombre))
			generaDatosCarrera(carrera, universidad, datos_asignaturas, datos_profesores);
			datos_carreras.push(carrera);
			datos_carreras_universidad.push(carrera);
		}

		calculaNotaUniversidad(universidad, datos_carreras_universidad);
		datos_universidades.push(universidad);
	}

	return {
		datos_universidades : datos_universidades,
		datos_carreras : datos_carreras,
		datos_asignaturas : datos_asignaturas,
		datos_profesores : datos_profesores
	}
}