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

function hayVotosDeAsignatura(id_asignatura, votos)
{
	var encontrado = false;
	var i = votos.length - 1;

	while(!encontrado && i >=0)
	{
		if (votos[i].asignatura === id_asignatura)
			encontrado = true;

		i--
	}

	return encontrado;
}

function obtenVotosAsignatura(id_asignatura, votos)
{
	var votos_de_asignatura = [];
	for (var i = 0; i < votos.length ; i++)
	{
		//Si el voto es de la asignatura que estamos revisando...
		if (votos[i].asignatura === id_asignatura)
		{
			votos_de_asignatura.push(votos[i].cuestionario);
		}
	}

	return votos_de_asignatura;
}

function notaAsignaturaFinal(votos_asignatura)
{
	var nota = 0;
	for (var i = 0; i < votos_asignatura.length; i++)
	{
		for (var j = 0; j < 10; j ++)
		{
			nota = nota + votos_asignatura[i][j]
		}

	}
	return nota / (10 * votos_asignatura.length)
}

function notaAsignaturaPorPregunta(votos_asignatura)
{
	var notas_por_pregunta = [0,0,0,0,0,0,0,0,0,0];

	for (var i = 0; i < votos_asignatura.length; i++)
	{
		for (var j = 0; j < 10; j ++)
		{
			notas_por_pregunta[j] += votos_asignatura[i][j]
		}
	}

	for (var i = 0; i < 10; i ++)
		notas_por_pregunta[i] /= votos_asignatura.length

	return notas_por_pregunta
}

function notaProfesorFinal(asignaturas, votos)
{
	var nota = 0;
	var num_votos = 0;

	for (var i = 0; i < asignaturas.length; i++)
	{
		var votos_asignatura = obtenVotosAsignatura(asignaturas[i]._id, votos);

		if (votos_asignatura.length > 0)
		{

			var nota_asignatura = notaAsignaturaFinal(asignaturas[i]._id, votos_asignatura)

			nota += nota_asignatura
			num_votos += votos_asignatura.length
		}
	}

	return nota / asignaturas.length
}

function notaProfesorPorPregunta(asignaturas, votos)
{
	var notas_por_pregunta = [0,0,0,0,0,0,0,0,0,0];
	var num_votos = 0;

	for (var i = 0; i < asignaturas.length; i++)
	{
		var votos_asignatura = obtenVotosAsignatura(asignaturas[i]._id, votos);

		if (votos_asignatura.length > 0) {
			var nota_asignatura_por_pregunta = notaAsignaturaPorPregunta(asignaturas[i]._id, votos_asignatura)

			for (var j = 0; j < 10; j++)
				notas_por_pregunta[j] += nota_asignatura_por_pregunta[j]

			num_votos += votos_asignatura.length
		}
	}

	for (var i = 0; i < 10; i++)
		notas_por_pregunta[i] = (notas_por_pregunta[i] / num_votos).toFixed(2);

	return notas_por_pregunta
}

function calculaNotasProfesor(asignaturas, votos) {

	var nota_final = notaProfesorFinal(asignaturas, votos);
	var notas_por_pregunta = notaProfesorPorPregunta(asignaturas, votos)

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
	$scope.profesor.nota_final;
	$scope.profesor.notas_por_asignatura;
	$scope.profesor.notas_por_pregunta;
	$scope.profesor.asignaturas = [];
	$scope.asignatura_seleccionada = {};
	/*TODO - Cambiar ng-init para obtener al profesor por parámetro en lugar de con window.profesor */
	$scope.init = function () {

		$scope.profesor = window.profesor;
		$scope.profesor.asignaturas = window.profesor.asignaturas;
		$scope.profesor.votos = window.profesor.votos;
		$scope.nota_asignatura_seleccionada = 0;

		var notas = calculaNotasProfesor($scope.profesor.asignaturas, $scope.profesor.votos);

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

		$scope.refrescaGrafica(0);
	}

	$scope.refrescaGrafica = function (e, indice) {
		var canvas_nota_asignatura = document.getElementById('resultado-asignatura');
		var contexto_canvas = canvas_nota_asignatura.getContext('2d');

		if (!hayVotosDeAsignatura($scope.profesor.asignaturas[indice]._id, $scope.profesor.votos)) {
			contexto_canvas.clearRect(0, 0, canvas_nota_asignatura.width, canvas_nota_asignatura.height);
			contexto_canvas.font = "30px Helvetica";
			contexto_canvas.fillStyle = "grey";
			contexto_canvas.textAlign = "center";
			contexto_canvas.fillText("No hay datos suficientes de esta asignatura", canvas_nota_asignatura.width/2, canvas_nota_asignatura.height/4);
		}
		else {

			$scope.asignatura_seleccionada.nombre = $scope.profesor.asignaturas[indice].nombre;
			$scope.asignatura_seleccionada.codigo = $scope.profesor.asignaturas[indice].codigo;
			var votos_asignatura = obtenVotosAsignatura($scope.profesor.asignaturas[indice]._id, $scope.profesor.votos);
			$scope.asignatura_seleccionada.nota_final_voto = notaAsignaturaFinal($scope.profesor.asignaturas[indice]._id, votos_asignatura);
			$scope.asignatura_seleccionada.notas_por_pregunta = notaAsignaturaPorPregunta($scope.profesor.asignaturas[indice]._id, votos_asignatura);

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