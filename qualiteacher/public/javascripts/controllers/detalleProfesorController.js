var QualiteacherApp = angular.module("Qualiteacher");

function getLabels()
{
	return ["Pregunta 1", "Pregunta 2", "Pregunta 3", "Pregunta 4", "Pregunta 5", "Pregunta 6", "Pregunta 7", "Pregunta 8", "Pregunta 9", "Pregunta 10"]
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

function hayVotosDeAsignatura(recuento_notas_por_pregunta)
{
	for (var i = 0; i < recuento_notas_por_pregunta.length; i++)
	{
		for (var j = 0; j < recuento_notas_por_pregunta[i].length; j++)
		{
			if (recuento_notas_por_pregunta[i][j] !== 0) return true;
		}
	}
	return false;
}

function notaAsignaturaFinal(notas_por_pregunta)
{
	var nota = 0;
	for (var i = 0; i < notas_por_pregunta.length; i++)
	{
		nota += notas_por_pregunta[i]
	}
	return nota / 10
}

function notaAsignaturaPorPregunta(recuento_notas_por_pregunta)
{
	var notas_por_pregunta = [0,0,0,0,0,0,0,0,0,0];
	var num_votos_por_pregunta = [0,0,0,0,0,0,0,0,0,0];

	for (var i = 0; i < recuento_notas_por_pregunta.length; i++)
	{
		for (var j = 0; j < recuento_notas_por_pregunta[i].length; j ++)
		{
			num_votos_por_pregunta[i] += recuento_notas_por_pregunta[i][j];
			notas_por_pregunta[i] += recuento_notas_por_pregunta[i][j] * j
		}
	}

	for (var i = 0; i < 10; i ++)
		notas_por_pregunta[i] /= num_votos_por_pregunta[i]

	return notas_por_pregunta
}

function notaProfesorFinal(asignaturas)
{
	var nota = 0;
	var asignaturas_sin_votos = 0;

	for (var i = 0; i < asignaturas.length; i++)
	{
		if (hayVotosDeAsignatura(asignaturas[i].recuento_notas_por_pregunta))
		{
			var nota_asignatura_por_pregunta = notaAsignaturaPorPregunta(asignaturas[i].recuento_notas_por_pregunta);
			var nota_asignatura = notaAsignaturaFinal(nota_asignatura_por_pregunta);

			nota += nota_asignatura
		}
		else
			asignaturas_sin_votos += 1;
	}

	return nota / (asignaturas.length - asignaturas_sin_votos);
}

function notaProfesorPorPregunta(asignaturas)
{
	var notas_por_pregunta = [0,0,0,0,0,0,0,0,0,0];
	var asignaturas_sin_votos = 0;

	for (var i = 0; i < asignaturas.length; i++)
	{
		if (hayVotosDeAsignatura(asignaturas[i].recuento_notas_por_pregunta)) {
			var nota_asignatura_por_pregunta = notaAsignaturaPorPregunta(asignaturas[i].recuento_notas_por_pregunta);

			for (var j = 0; j < 10; j++)
				notas_por_pregunta[j] += nota_asignatura_por_pregunta[j]
		}
		else
			asignaturas_sin_votos += 1;
	}

	for (var i = 0; i < 10; i++)
		notas_por_pregunta[i] = (notas_por_pregunta[i] / (asignaturas.length - asignaturas_sin_votos)).toFixed(2);

	return notas_por_pregunta
}

function ObtenNotasProfesor(asignaturas) {

	var nota_final = notaProfesorFinal(asignaturas);
	var notas_por_pregunta = notaProfesorPorPregunta(asignaturas)

	return {
		nota_final: nota_final,
		notas_por_pregunta: notas_por_pregunta
	}
}

/*******************************************************************************
 * Controlador
 *******************************************************************************/

QualiteacherApp.controller('detalleProfesorController', function($scope) {

	$scope.profesor = {};
	$scope.profesor.asignaturas = [];
	$scope.asignatura_seleccionada = {};

	$scope.init = function (profesor) {

		$scope.profesor = JSON.parse(profesor);
		$scope.nota_asignatura_seleccionada = 0;

		var notas = ObtenNotasProfesor($scope.profesor.asignaturas);

		$scope.profesor.nota_final = notas.nota_final;
		$scope.profesor.notas_por_pregunta = notas.notas_por_pregunta;

		var canvas_nota_global = document.getElementById('resultado-global').getContext('2d');
		var labels = getLabels();
		var color_grafica_nota_final = getColorRadarSegunNota($scope.profesor.nota_final)
		new Chart(canvas_nota_global, {
			type: 'radar',
			data: {
				labels: labels,
				datasets: [{
					label: "Calificación global",
					data: $scope.profesor.notas_por_pregunta,
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
							max: 10 //max value for the chart is 60
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
	};

	$(document).ready(function () {
		$(".list-group-item").first().trigger("click");
	});

	$scope.refrescaGrafica = function (e, indice) {
		var canvas_nota_asignatura = document.getElementById('resultado-asignatura');
		var contexto_canvas = canvas_nota_asignatura.getContext('2d');

		if (!hayVotosDeAsignatura($scope.profesor.asignaturas[indice].recuento_notas_por_pregunta)) {
			contexto_canvas.clearRect(0, 0, canvas_nota_asignatura.width, canvas_nota_asignatura.height);
			contexto_canvas.font = "30px Helvetica";
			contexto_canvas.fillStyle = "grey";
			contexto_canvas.textAlign = "center";
			contexto_canvas.fillText("No hay datos suficientes de esta asignatura", canvas_nota_asignatura.width/2, canvas_nota_asignatura.height/4);
		}
		else {

			$scope.asignatura_seleccionada.nombre = $scope.profesor.asignaturas[indice].nombre;
			$scope.asignatura_seleccionada.codigo = $scope.profesor.asignaturas[indice].codigo;
			$scope.asignatura_seleccionada.notas_por_pregunta = notaAsignaturaPorPregunta($scope.profesor.asignaturas[indice].recuento_notas_por_pregunta);
			$scope.asignatura_seleccionada.nota_final_voto = notaAsignaturaFinal($scope.asignatura_seleccionada.notas_por_pregunta);

			var labels = getLabels();
			var color_grafica_nota_asignatura = getColorRadarSegunNota($scope.asignatura_seleccionada.nota_final_voto)

			new Chart(contexto_canvas, {
				type: 'radar',
				data: {
					labels: labels,
					datasets: [{
						label: "Calificación de " + $scope.asignatura_seleccionada.codigo,
						data: $scope.asignatura_seleccionada.notas_por_pregunta,
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