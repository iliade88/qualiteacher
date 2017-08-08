var QualiteacherApp = angular.module("Qualiteacher");

function buscaNotasAsignatura(id_asignatura, notas_asignaturas_prof)
{
	for (var i = 0; i < notas_asignaturas_prof.length; i++)
	{
		if (id_asignatura === notas_asignaturas_prof[i].asignatura)
			return i;
	}
	return -1;
}

/*******************************************************************************
 * Controlador
 *******************************************************************************/

QualiteacherApp.controller('detalleAsignaturaController', function ($scope)
{
	$scope.asignatura = {}
	$scope.profesor_seleccionado = {};
	$scope.datos_grafica = {};

	$scope.init = function (asignatura)
	{
		$scope.asignatura = JSON.parse(asignatura);

		$scope.datos_grafica.nota = $scope.asignatura.nota;
		$scope.datos_grafica.txt_num_votos = "La asignatura ha sido votada "+$scope.asignatura.num_votos+" veces";
		$scope.profesor_seleccionado = $scope.asignatura.profesores[0];
		$scope.profesor_seleccionado.con_resultados = false;

		var canvas_nota_asignatura = document.getElementById('resultados-asignatura');
		var contexto_canvas = canvas_nota_asignatura.getContext('2d');

		var labels = getLabels();
		var color_grafica_nota_asignatura = getColorRadarSegunNota($scope.asignatura.nota);
		var notas_asignatura_pp = ObtenNotasDeNumNotasPP($scope.asignatura.num_notas_pp, $scope.asignatura.num_votos);

		$scope.datos_grafica.grafica = new Chart(contexto_canvas, {
			type: 'radar',
			data: {
				labels: labels,
				datasets: [{
					label: "Calificación de " + $scope.asignatura.codigo,
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
	};

	$scope.refrescaGrafica = function (e, indice) {

		var canvas_nota_asignatura = document.getElementById('resultados-asignatura');
		var contexto_canvas = canvas_nota_asignatura.getContext('2d');
		var color_grafica_nota_asignatura;

		var labels = getLabels();
		$scope.datos_grafica.grafica.destroy();

		if (indice === -1)
		{
			color_grafica_nota_asignatura = getColorRadarSegunNota($scope.asignatura.nota)
			var notas_asignatura_pp = ObtenNotasDeNumNotasPP($scope.asignatura.num_notas_pp, $scope.asignatura.num_votos);

			$scope.datos_grafica.grafica = new Chart(contexto_canvas, {
				type: 'radar',
				data: {
					labels: labels,
					datasets: [{
						label: "Calificación de " + $scope.asignatura.codigo,
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

			$scope.datos_grafica.nota = $scope.asignatura.nota;
			$scope.datos_grafica.txt_num_votos = "La asignatura ha sido votada "+$scope.asignatura.num_votos+" veces";
			$scope.profesor_seleccionado.con_resultados = false;
		}
		else{
			var indice_asignatura_prof = buscaNotasAsignatura($scope.asignatura._id, $scope.asignatura.profesores[indice].notas_asignaturas_prof);

			if (indice_asignatura_prof === -1) {
				contexto_canvas.clearRect(0, 0, canvas_nota_asignatura.width, canvas_nota_asignatura.height);
				contexto_canvas.font = "30px Helvetica";
				contexto_canvas.fillStyle = "grey";
				contexto_canvas.textAlign = "center";
				contexto_canvas.fillText("No hay datos suficientes de esta asignatura", canvas_nota_asignatura.width/2, canvas_nota_asignatura.height/4);
				$scope.datos_grafica.nota_final = 0;
				$scope.datos_grafica.txt_num_votos = "";
				$scope.profesor_seleccionado.con_resultados = false;
			}
			else {

				var notas_profesor_pp = ObtenNotasDeNumNotasPP($scope.asignatura.profesores[indice].notas_asignaturas_prof[indice_asignatura_prof].num_notas_pp, $scope.asignatura.profesores[indice].notas_asignaturas_prof[indice_asignatura_prof].num_votos);

				color_grafica_nota_asignatura = getColorRadarSegunNota($scope.asignatura.profesores[indice].notas_asignaturas_prof[indice_asignatura_prof].nota_asignatura);

				$scope.datos_grafica.grafica = new Chart(contexto_canvas, {
					type: 'radar',
					data: {
						labels: labels,
						datasets: [{
							label: "Nota de pregunta",
							data: notas_profesor_pp,
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

				$scope.profesor_seleccionado = $scope.asignatura.profesores[indice];
				$scope.datos_grafica.nota = $scope.profesor_seleccionado.notas_asignaturas_prof[indice_asignatura_prof].nota_asignatura;
				$scope.datos_grafica.txt_num_votos = $scope.profesor_seleccionado.notas_asignaturas_prof[indice_asignatura_prof].num_votos+" votos";

				$scope.profesor_seleccionado.con_resultados = true;
			}
		}

		$(".list-group .list-group-item").removeClass("active");
		$(e.target).addClass("active");
	}
});
