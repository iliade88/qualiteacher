var QualiteacherApp = angular.module("Qualiteacher");

/*******************************************************************************
 * Controlador
 *******************************************************************************/

QualiteacherApp.controller('detalleCarreraController', function ($scope)
{
	$scope.carrera = {}
	$scope.asignaturas_pager = []
	$scope.pag = 0;
	$scope.max_pag = 0;
	$scope.asignatura_seleccionada = {};
	$scope.datos_grafica = {};

	$scope.init = function (asignatura)
	{
		$scope.carrera = JSON.parse(asignatura);
		$scope.datos_grafica.nota = $scope.carrera.nota;
		$scope.datos_grafica.txt_num_votos = "La carrera se ha votado "+$scope.carrera.num_votos+" veces";

		$scope.asignatura_seleccionada = $scope.carrera.asignaturas[0];
		$scope.asignatura_seleccionada.con_resultados = false;

		$scope.max_pag = Math.round($scope.carrera.asignaturas.length / 10)
		$scope.asignaturas_pager = $scope.carrera.asignaturas.slice(0, 10);
		console.log($scope.carrera.asignaturas.length)

		var canvas_nota_asignatura = document.getElementById('resultados-asignatura');
		var contexto_canvas = canvas_nota_asignatura.getContext('2d');

		var labels = getLabels();
		var color_grafica_nota_asignatura = getColorRadarSegunNota($scope.carrera.nota)

		var notas_carrera_pp = ObtenNotasDeNumNotasPP($scope.carrera.num_notas_pp, $scope.carrera.num_votos);

		$scope.datos_grafica.grafica = new Chart(contexto_canvas, {
			type: 'radar',
			data: {
				labels: labels,
				datasets: [{
					label: "Calificación de " + $scope.carrera.codigo,
					data: notas_carrera_pp,
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
	};

	$scope.refrescaGrafica = function (e, indice) {

		var canvas_nota_asignatura = document.getElementById('resultados-asignatura');
		var contexto_canvas = canvas_nota_asignatura.getContext('2d');
		var color_grafica_nota_asignatura;

		var labels = getLabels();
		$scope.datos_grafica.grafica.destroy();
		if (indice === -1)
		{
			color_grafica_nota_asignatura = getColorRadarSegunNota($scope.carrera.nota)

			var notas_carrera_pp = ObtenNotasDeNumNotasPP($scope.carrera.num_notas_pp, $scope.carrera.num_votos);

			$scope.datos_grafica.grafica = new Chart(contexto_canvas, {
				type: 'radar',
				data: {
					labels: labels,
					datasets: [{
						label: "Calificación de " + $scope.carrera.codigo,
						data: notas_carrera_pp,
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

			$scope.datos_grafica.nota_final = $scope.carrera.nota;
			$scope.datos_grafica.txt_num_votos = "La carrera se ha votado "+$scope.carrera.num_votos+" veces";
			$scope.asignatura_seleccionada.con_resultados = false;
		}
		else {

			if ($scope.carrera.asignaturas[indice].num_votos === 0)
			{
				contexto_canvas.clearRect(0, 0, canvas_nota_asignatura.width, canvas_nota_asignatura.height);
				contexto_canvas.font = "2em Helvetica";
				contexto_canvas.fillStyle = "grey";
				contexto_canvas.textAlign = "center";
				contexto_canvas.fillText("No hay datos suficientes de esta asignatura", canvas_nota_asignatura.width/2, canvas_nota_asignatura.height/4);
				$scope.datos_grafica.nota_final = 0;
				$scope.datos_grafica.txt_num_votos = "";
				$scope.asignatura_seleccionada.con_resultados = false;
			}
			else
			{
				color_grafica_nota_asignatura = getColorRadarSegunNota($scope.carrera.asignaturas[indice].nota)
				var notas_asignatura_pp = ObtenNotasDeNumNotasPP($scope.carrera.asignaturas[indice].num_notas_pp, $scope.carrera.asignaturas[indice].num_votos);

				$scope.datos_grafica.grafica = new Chart(contexto_canvas, {
					type: 'radar',
					data: {
						labels: labels,
						datasets: [{
							label: "Calificación total " + $scope.carrera.asignaturas[indice].nota,
							data: notas_asignatura_pp,
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

				$scope.asignatura_seleccionada = $scope.carrera.asignaturas[indice];
				$scope.asignatura_seleccionada.con_resultados = true;
				$scope.datos_grafica.nota = $scope.asignatura_seleccionada.nota;
				$scope.datos_grafica.txt_num_votos = $scope.asignatura_seleccionada.num_votos+" votos";
			}
		}

		$(".list-group .list-group-item").removeClass("active");
		$(e.target).addClass("active");
	}

	$scope.nextPage = function ()
	{
		if ($scope.pag === $scope.max_pag) return;

		$scope.pag++;
		var indice_min_asignatura = 10 * $scope.pag;
		var indice_max_asignatura = 10 * ($scope.pag + 1);
		$scope.asignaturas_pager = $scope.carrera.asignaturas.slice(indice_min_asignatura, indice_max_asignatura)
	}

	$scope.prevPage = function ()
	{
		if ($scope.pag === 0) return;

		$scope.pag--;
		var indice_min_asignatura = 10 * $scope.pag;
		var indice_max_asignatura = 10 * ($scope.pag + 1);
		$scope.asignaturas_pager = $scope.carrera.asignaturas.slice(indice_min_asignatura, indice_max_asignatura)
	}
});
