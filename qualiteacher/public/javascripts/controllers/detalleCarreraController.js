var QualiteacherApp = angular.module("Qualiteacher");

function obtenNotaFinalCarrera(asignaturas)
{
	var nota_carrera = 0;
	var asignaturas_con_nota = 0;
	for (var i in asignaturas)
	{
		var nota_asignatura = 0;

		nota_asignatura = obtenNotaFinalAsignatura(asignaturas[i]);

		if (nota_asignatura !== -1) {
			nota_carrera += nota_asignatura;
			asignaturas_con_nota++;
		}
	}

	if (asignaturas_con_nota > 0)
		return nota_carrera / asignaturas_con_nota;
	else
		return -1;
}

function obtenNotasCarrera(asignaturas)
{
	var notas_carrera = {
		nota_total_carrera : 0,
		nota_por_pregunta_carrera : [0,0,0,0,0,0,0,0,0,0],
		notas_por_asignatura : []
	}

	for (var i = 0; i < asignaturas.length; i++)
	{
		var notas_asignatura = obtenNotasAsignatura(asignaturas[i])

		if (!isNaN(notas_asignatura.nota_final))
			notas_carrera.notas_por_asignatura.push(notas_asignatura);
	}

	for (var i = 0; i < notas_carrera.notas_por_asignatura.length; i++)
	{
		notas_carrera.nota_total_carrera += notas_carrera.notas_por_asignatura[i].nota_final;

		for (var j = 0; j < 10; j++)
		{
			notas_carrera.nota_por_pregunta_carrera[j] += notas_carrera.notas_por_asignatura[i].nota_final_por_pregunta[j];
		}
	}

	notas_carrera.nota_total_carrera /= notas_carrera.notas_por_asignatura.length;
	for (var i = 0; i < 10; i++)
	{
		notas_carrera.nota_por_pregunta_carrera[i] /= notas_carrera.notas_por_asignatura.length;
	}

	return notas_carrera;
}

/*******************************************************************************
 * Controlador
 *******************************************************************************/

QualiteacherApp.controller('detalleCarreraController', function ($scope)
{
	$scope.carrera = {}
	$scope.asignatura_seleccionada;
	$scope.datos_grafica = {};

	$scope.muestraScope = function ()
	{
		console.log($scope.carrera)
	}

	$scope.init = function (asignatura)
	{
		$scope.carrera = JSON.parse(asignatura);
		console.log($scope.carrera)
		var notas = obtenNotasCarrera($scope.carrera.asignaturas);
		$scope.carrera.notas = notas;
		$scope.datos_grafica.nota_final = notas.nota_total_carrera;
		$scope.asignatura_seleccionada = $scope.carrera.asignaturas[0];
		$scope.asignatura_seleccionada.con_resultados = false;

		var canvas_nota_asignatura = document.getElementById('resultados-asignatura');
		var contexto_canvas = canvas_nota_asignatura.getContext('2d');

		var labels = getLabels();
		var color_grafica_nota_asignatura = getColorRadarSegunNota($scope.carrera.notas.nota_total_carrera)

		$scope.datos_grafica.grafica = new Chart(contexto_canvas, {
			type: 'radar',
			data: {
				labels: labels,
				datasets: [{
					label: "Calificación de " + $scope.carrera.codigo,
					data: $scope.carrera.notas.nota_por_pregunta_carrera,
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
			color_grafica_nota_asignatura = getColorRadarSegunNota($scope.carrera.notas.nota_total_carrera)

			$scope.datos_grafica.grafica = new Chart(contexto_canvas, {
				type: 'radar',
				data: {
					labels: labels,
					datasets: [{
						label: "Calificación de " + $scope.carrera.codigo,
						data: $scope.carrera.notas.nota_por_pregunta_carrera,
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

			$scope.datos_grafica.nota_final = $scope.carrera.notas.nota_total_carrera;
			$scope.asignatura_seleccionada.con_resultados = false;
		}
		else {

			var notas_asignatura = obtenNotasAsignatura($scope.carrera.asignaturas[indice])

			if (isNaN(notas_asignatura.nota_final))
			{
				contexto_canvas.clearRect(0, 0, canvas_nota_asignatura.width, canvas_nota_asignatura.height);
				contexto_canvas.font = "2em Helvetica";
				contexto_canvas.fillStyle = "grey";
				contexto_canvas.textAlign = "center";
				contexto_canvas.fillText("No hay datos suficientes de esta asignatura", canvas_nota_asignatura.width/2, canvas_nota_asignatura.height/4);
				$scope.datos_grafica.nota_final = 0;
				$scope.asignatura_seleccionada.con_resultados = false;
			}
			else
			{
				color_grafica_nota_asignatura = getColorRadarSegunNota(notas_asignatura.nota_final)
				$scope.asignatura_seleccionada = $scope.carrera.asignaturas[indice];
				$scope.asignatura_seleccionada.con_resultados = true;

				$scope.datos_grafica.grafica = new Chart(contexto_canvas, {
					type: 'radar',
					data: {
						labels: labels,
						datasets: [{
							label: "Calificación total " + notas_asignatura.nota_final,
							data: notas_asignatura.nota_final_por_pregunta,
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

				$scope.datos_grafica.nota_final = notas_asignatura.nota_final;
			}
		}

		$(".list-group .list-group-item").removeClass("active");
		$(e.target).addClass("active");
	}
});
