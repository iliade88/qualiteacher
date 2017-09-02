var QualiteacherApp = angular.module("Qualiteacher");

function getLabels()
{
	return ["Pregunta 1", "Pregunta 2", "Pregunta 3", "Pregunta 4", "Pregunta 5", "Pregunta 6", "Pregunta 7", "Pregunta 8", "Pregunta 9", "Pregunta 10"]
}

function getTextosPuntoFuerteYDebil(posicion)
{
	var textos = [
		"El/la profesor/a proporciona información adecuada sobre la actividad docente al comienzo del curso",
		"El/la profesor/a tiene la capacidad de enseñar",
		"El/la profesor/a es accesible en sus tutorías, ya sea personal o virtualmente",
		"El/la profesor/a despierta el interés por la materia que imparte",
		"El/la profesor/a muestra un conocimiento y formación adecuados de la materia",
		"El/la profesor/a mantiene un buen clima de comunicación con los estudiantes",
		"Los materiales y recursos docentes recomendados y utilizados por el/la profesor/a me han facilitado el aprendizaje",
		"El desarrollo de la actividad docente del/de la profesor/a se adecua a los planes y objetivos establecidos",
		"El/La profesor/a facilitada el aprendizaje, gracias a su ayuda se logra mejorar los conocimientos, habilidades, o modo de afrontar determinados temas",
		"En general, sus alumnos están satisfechos con la labor de este/a profesor/a"
	]

	return textos[posicion]
}

function creaLeyenda()
{
	return "<table id='leyenda_nota'>" +
	"<thead><tr><th>Número</th><th>Pregunta de calidad</th></tr></thead>" +
	"<tbody><tr><td>1</td><td>La información que me ha proporcionado el/la profesor/a sobre la actividad docente al comienzo del curso (objetivos, planificación, actividades y sistema de evaluación) ha sido adecuada</td></tr>"+
	"		<tr><td>2</td><td>El/la profesor/a tiene la capacidad de enseñar</td></tr>"+
	"		<tr><td>3</td><td>El/la profesor/a es accesible en sus tutorías, ya sea personal o virtualmente</td></tr>"+
	"		<tr><td>4</td><td>El/la profesor/a me despierta el interés por la materia que imparte</td></tr>"+
	"		<tr><td>5</td><td>El/la profesor/a muestra un conocimiento y formación adecuados de la materia</td></tr>"+
	"		<tr><td>6</td><td>El/la profesor/a mantiene un buen clima de comunicación con los estudiantes</td></tr>"+
	"		<tr><td>7</td><td>Los materiales y recursos docentes recomendados y utilizados por el/la profesor/a me han facilitado el aprendizaje</td></tr>"+
	"		<tr><td>8</td><td>El desarrollo de la actividad docente del/de la profesor/a se adecua a los planes y objetivos establecidos</td></tr>"+
	"		<tr><td>9</td><td>El/La profesor/a ha facilitado mi aprendizaje, gracias a su ayuda he logrado mejorar mis conocimientos, habilidades, o modo de afrontar determinados temas</td></tr>"+
	"		<tr><td>10</td><td>En general, estoy satisfecho con la labor de este/a profesor/a</td></tr></tr></tbody>" +
	"</table>"
}

function getColorRadarSegunNota(nota)
{
	var r, g, b;

	if (nota > 8){ r = 93; g = 255; b = 122; }
	else if (nota > 5){ r = 177; g = 244; b = 245; }
	else { r = 221; g = 72; b = 87; }

	return "rgba("+r+", "+g+", "+b+", 0.4)";
}

function ObtenNotasDeNumNotasPP(num_notas_pp, num_votos) {

	var notas_pp = [0,0,0,0,0,0,0,0,0,0]


	for (var i = 0; i < num_notas_pp.length; i++)
	{
		var suma_pregunta = 0;
		for (var j = 0; j < num_notas_pp[i].length; j++)
		{
			suma_pregunta += (num_notas_pp[i][j] * j);
		}
		notas_pp[i] = Math.round((suma_pregunta / num_votos) * 100) / 100;
	}

	return notas_pp
}

/*******************************************************************************
 * Controlador
 *******************************************************************************/

QualiteacherApp.controller('detalleProfesorController', function($scope) {

	$scope.profesor = {};
	$scope.profesor.asignaturas = [];
	$scope.asignatura_seleccionada = {};
	$scope.profesor_sin_votos = false;
	$scope.grafica;

	$scope.init = function (profesor) {

		$scope.profesor = JSON.parse(profesor);
		$scope.profesor["punto_fuerte"] = "asd"
		$scope.profesor["punto_debil"] = "fds"
		$scope.notas_profesor_pp = ObtenNotasDeNumNotasPP($scope.profesor.num_notas_pp, $scope.profesor.num_votos)
		$scope.obtenPuntoFuerteYDebil($scope.notas_profesor_pp)

		$scope.nota_asignatura_seleccionada = 0;
		$scope.profesor_sin_votos = ($scope.profesor.num_votos === 0);
	};

	$scope.obtenPuntoFuerteYDebil = function(notas_profesor_pp)
	{
		var max_nota = Math.max.apply(null, notas_profesor_pp)
		var min_nota = Math.min.apply(null, notas_profesor_pp)

		var indice_max_nota = notas_profesor_pp.indexOf(max_nota)
		var indice_min_nota = notas_profesor_pp.indexOf(min_nota)

		$scope.profesor.punto_fuerte = getTextosPuntoFuerteYDebil(indice_max_nota)
		$scope.profesor.punto_debil = getTextosPuntoFuerteYDebil(indice_min_nota);
	}


	$(document).ready(function () {
		$(".list-group-item").first().trigger("click");

		var canvas_nota_prof = document.getElementById('resultado-global');
		var contexto_nota_prof = canvas_nota_prof.getContext('2d');
		var labels = getLabels();
		var color_grafica_nota_final = getColorRadarSegunNota($scope.profesor.nota)

		if ($scope.profesor_sin_votos) {

			contexto_nota_prof.clearRect(0, 0, canvas_nota_prof.width, canvas_nota_prof.height);
			contexto_nota_prof.font = "5em Helvetica";
			contexto_nota_prof.fillStyle='#a3ab8e';
			contexto_nota_prof.textAlign = "center";
			contexto_nota_prof.fillText("Sin datos", canvas_nota_prof.width / 2, canvas_nota_prof.height / 2);
		}
		else
		{
			new Chart(canvas_nota_prof, {
				type: 'radar',
				data: {
					labels: labels,
					datasets: [{
						label: "Calificación global",
						data: $scope.notas_profesor_pp,
						fill: true,
						backgroundColor: color_grafica_nota_final
					}]
				},
				options: {
					responsive: true,
					legendCallback: creaLeyenda(),
					scale: {
						ticks: {
							beginAtZero: true,
							steps: 10,
							stepValue: 1,
							max: 10
						}
					},
					scale: {
						ticks: {
							beginAtZero: true,
							max: 10
						}
					}
				}
			});
		}
	});

	$scope.refrescaGrafica = function (e, indice) {
		var canvas_nota_asignatura = document.getElementById('resultado-asignatura');
		var contexto_canvas = canvas_nota_asignatura.getContext('2d');

		if ($scope.grafica != null)
			$scope.grafica.destroy();

		if ($scope.profesor.notas_asignaturas_prof[indice].num_votos === 0) {
			contexto_canvas.clearRect(0, 0, canvas_nota_asignatura.width, canvas_nota_asignatura.height);
			contexto_canvas.font = "30px Helvetica";
			contexto_canvas.fillStyle = "grey";
			contexto_canvas.textAlign = "center";
			contexto_canvas.fillText("No hay datos suficientes de esta asignatura", canvas_nota_asignatura.width/2, canvas_nota_asignatura.height/4);
		}
		else {

			$scope.asignatura_seleccionada = {
				_id: $scope.profesor.notas_asignaturas_prof[indice].asignatura._id,
				codigo: $scope.profesor.notas_asignaturas_prof[indice].asignatura.codigo,
				nota: $scope.profesor.notas_asignaturas_prof[indice].nota_asignatura,
				num_votos: $scope.profesor.notas_asignaturas_prof[indice].num_votos
			}
			var labels = getLabels();
			var color_grafica_nota_asignatura = getColorRadarSegunNota($scope.profesor.notas_asignaturas_prof[indice].nota_asignatura)

			var nota_asignatura_pp = ObtenNotasDeNumNotasPP($scope.profesor.notas_asignaturas_prof[indice].num_notas_pp, $scope.profesor.num_votos);

			$scope.grafica = new Chart(contexto_canvas, {
				type: 'radar',
				data: {
					labels: labels,
					datasets: [{
						label: "Calificación de " + $scope.profesor.notas_asignaturas_prof[indice].codigo,
						data: nota_asignatura_pp,
						fill: true,
						backgroundColor: color_grafica_nota_asignatura
					}]
				},
				options: {
					responsive: true,
					legend: {
						display: false
					},
					scale: {
						ticks: {
							beginAtZero: true,
							max: 10
						}
					}
				}
			});
		}

		$(".list-group .list-group-item").removeClass("active");
		$(e.target).addClass("active");
	}
});