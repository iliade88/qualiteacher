var QualiteacherApp = angular.module("Qualiteacher");

function obtenNotasAsignaturaSegunProfesor(asignatura, profesor)
{
	var votos_asignatura = obtenVotosAsignatura(asignatura._id, profesor.votos);

	var nota_final_profesor_n = notaAsignaturaFinal(votos_asignatura);
	var nota_por_pregunta_profesor_n = notaAsignaturaPorPregunta(votos_asignatura)

	return {
		nota_final: nota_final_profesor_n,
		nota_por_pregunta: nota_por_pregunta_profesor_n
	}
}

function obtenNotaFinalAsignatura(asignatura)
{
	var notas_profesores = [];
	for (var i in asignatura.profesores)
	{
		var profesor = asignatura.profesores[i];

		var votos_asignatura = obtenVotosAsignatura(asignatura._id, profesor.votos);
		var notas_profesor = notaAsignaturaFinal(votos_asignatura);

		notas_profesores.push(notas_profesor);
	}

	var resultados_filtrados = notas_profesores.filter(function (item) { return !isNaN(item) });

	var nota_final_asignatura = 0;
	for (var i = 0; i < resultados_filtrados.length; i++)
	{
		nota_final_asignatura += resultados_filtrados[i];
	}

	if (resultados_filtrados.length > 0)
		return nota_final_asignatura / resultados_filtrados.length;
	else
		return -1;
}

function obtenNotasAsignatura(asignatura)
{
	var resultados = [];
	for (var i = 0; i < asignatura.profesores.length; i++)
	{
		var profesor = asignatura.profesores[i];

		var votos_asignatura = obtenVotosAsignatura(asignatura._id, profesor.votos);
		var nota_final_profesor_n = notaAsignaturaFinal(votos_asignatura);
		var nota_por_pregunta_profesor_n = notaAsignaturaPorPregunta(votos_asignatura)

		var resultado_profesor = {
			nota_final: nota_final_profesor_n,
			nota_por_pregunta: nota_por_pregunta_profesor_n
		}
		resultados.push(resultado_profesor);
	}

	var resultados_filtrados = resultados.filter(function (item) { return !isNaN(item.nota_final) })

	var nota_final_asignatura = 0;
	var nota_final_asignatura_por_pregunta = [0,0,0,0,0,0,0,0,0,0];
	for (var i = 0; i < resultados_filtrados.length; i++)
	{
		nota_final_asignatura += resultados_filtrados[i].nota_final;

		for (var j = 0; j < 10; j++)
		{
			nota_final_asignatura_por_pregunta[j] += resultados_filtrados[i].nota_por_pregunta[j]
		}
	}

	nota_final_asignatura = nota_final_asignatura / resultados_filtrados.length;
	for (var j = 0; j < 10; j++)
	{
		nota_final_asignatura_por_pregunta[j] /= resultados_filtrados.length;
	}

	return {
		nota_final: nota_final_asignatura,
		nota_final_por_pregunta: nota_final_asignatura_por_pregunta
	}
}

/*******************************************************************************
 * Controlador
 *******************************************************************************/

QualiteacherApp.controller('detalleAsignaturaController', function ($scope)
{
	$scope.asignatura = {}
	$scope.datos_grafica = {};

	$scope.init = function (asignatura)
	{
		$scope.asignatura = JSON.parse(asignatura);
		var notas = obtenNotasAsignatura($scope.asignatura);
		$scope.asignatura.notas = notas;
		$scope.datos_grafica.nota_final = notas.nota_final;

		var canvas_nota_asignatura = document.getElementById('resultados-asignatura');
		var contexto_canvas = canvas_nota_asignatura.getContext('2d');

		var labels = getLabels();
		var color_grafica_nota_asignatura = getColorRadarSegunNota($scope.asignatura.notas.nota_final)

		$scope.datos_grafica.grafica = new Chart(contexto_canvas, {
			type: 'radar',
			data: {
				labels: labels,
				datasets: [{
					label: "Calificación de " + $scope.asignatura.codigo,
					data: $scope.asignatura.notas.nota_final_por_pregunta,
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

	$scope.refrescaGrafica = function (e, indice) {

		var canvas_nota_asignatura = document.getElementById('resultados-asignatura');
		var contexto_canvas = canvas_nota_asignatura.getContext('2d');
		var color_grafica_nota_asignatura;

		var labels = getLabels();
		$scope.datos_grafica.grafica.destroy();
		if (indice === -1)
		{
			color_grafica_nota_asignatura = getColorRadarSegunNota($scope.asignatura.notas.nota_final)

			$scope.datos_grafica.grafica = new Chart(contexto_canvas, {
				type: 'radar',
				data: {
					labels: labels,
					datasets: [{
						label: "Calificación de " + $scope.asignatura.codigo,
						data: $scope.asignatura.notas.nota_final_por_pregunta,
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

			$scope.datos_grafica.nota_final = $scope.asignatura.notas.nota_final;
		}
		else if (!hayVotosDeAsignatura($scope.asignatura._id, $scope.asignatura.profesores[indice].votos)) {
				contexto_canvas.clearRect(0, 0, canvas_nota_asignatura.width, canvas_nota_asignatura.height);
				contexto_canvas.font = "30px Helvetica";
				contexto_canvas.fillStyle = "grey";
				contexto_canvas.textAlign = "center";
				contexto_canvas.fillText("No hay datos suficientes de esta asignatura", canvas_nota_asignatura.width/2, canvas_nota_asignatura.height/4);
				$scope.datos_grafica.nota_final = 0;
		}
		else {
			var notas_asignatura_profesor = obtenNotasAsignaturaSegunProfesor($scope.asignatura, $scope.asignatura.profesores[indice]);

			color_grafica_nota_asignatura = getColorRadarSegunNota(notas_asignatura_profesor.nota_final)

			$scope.datos_grafica.grafica = new Chart(contexto_canvas, {
				type: 'radar',
				data: {
					labels: labels,
					datasets: [{
						label: "Calificación total ",
						data: notas_asignatura_profesor.nota_por_pregunta,
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

			$scope.datos_grafica.nota_final = notas_asignatura_profesor.nota_final;
		}

		$(".list-group .list-group-item").removeClass("active");
		$(e.target).addClass("active");
	}
});
