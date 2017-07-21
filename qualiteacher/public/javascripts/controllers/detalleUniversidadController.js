var QualiteacherApp = angular.module("Qualiteacher");

function obtenerNotasUniversidad(carreras, profesores)
{
	for (var i in carreras)
	{
		carreras[i].nota = obtenNotaFinalCarrera(carreras[i].asignaturas);
	}

	for (var i in profesores)
	{
		profesores[i].nota =  notaProfesorFinal(profesores[i].asignaturas, profesores[i].votos);
	}
}

function transformaADatasetParaGrafica(elementos)
{
	var nombres = [];
	var valores = [];

	for (var i in elementos)
	{
		console.log(elementos[i].nombre + " - "+elementos[i].nota)
		nombres.push(elementos[i].nombre);
		valores.push(Math.round(elementos[i].nota * 100) / 100);
	}

	return {
		labels: nombres,
		datasets: [
			{
				label: "Calificación",
				data: valores
			}
		]
	};
}

function obtenerTopNProfesores(profesores, n)
{
	var profesoresOrdenados = profesores.sort(function (a, b) { if (a.nota > b.nota){return a;} else {return b;} })
	return profesoresOrdenados.slice(0, n);
}

function obtenerTopNUniversidades(carreras, n)
{
	var carrerasOrdenadas = carreras.sort(function (a, b) { if (a.nota > b.nota){return a;} else {return b;} })
	return carrerasOrdenadas.slice(0, n);
}

/*******************************************************************************
 * Controlador
 *******************************************************************************/

QualiteacherApp.controller('detalleUniversidadController', function ($scope)
{
	$scope.universidad = {}

	$scope.init = function (universidad)
	{
		$scope.universidad = JSON.parse(universidad);
		console.log($scope.universidad);

		obtenerNotasUniversidad($scope.universidad.carreras, $scope.universidad.profesores);
		var top_carreras = obtenerTopNUniversidades($scope.universidad.carreras, 5);
		console.log(top_carreras)
		var dataset_carreras = transformaADatasetParaGrafica(top_carreras);
		console.log(dataset_carreras)
		var top_profesores = obtenerTopNProfesores($scope.universidad.profesores, 5);
		console.log(top_profesores)
		var dataset_profesores = transformaADatasetParaGrafica(top_profesores);
		console.log(dataset_profesores)

		//Chart Carreras - $("#ranking-carreras")
		var canvas_carreras = document.getElementById('ranking-carreras');
		var contexto_canvas_carreras = canvas_carreras.getContext('2d');

		new Chart(contexto_canvas_carreras, {
			type: 'horizontalBar',
			data: dataset_carreras,
			options: {
				responsive: true,
				legend: {
					display: false
				},
				scales: {
					xAxes: [
						{
							ticks: {
								beginAtZero: true,
								max: 10
							}}
					],
					yAxes: [{
						stacked: true
					}]
				}
			}
		});

		//Chart Profesores - $("#ranking-profesores")
		var canvas_profesores = document.getElementById('ranking-profesores');
		var contexto_canvas_profesores = canvas_profesores.getContext('2d');

		new Chart(contexto_canvas_profesores, {
			type: 'horizontalBar',
			data: dataset_profesores,
			options: {
				responsive: true,
				legend: {
					display: false
				},
				scales: {
					xAxes: [
						{
							ticks: {
								beginAtZero: true,
								max: 10
						}}
					],
					yAxes: [{
						stacked: true
					}]
				}
			}
		});
	}
});
