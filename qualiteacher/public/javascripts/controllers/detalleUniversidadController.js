var QualiteacherApp = angular.module("Qualiteacher");

function transformaADatasetParaGrafica(elementos)
{
	var nombres = [];
	var valores = [];

	for (var i in elementos)
	{
		nombres.push(elementos[i].nombre);
		valores.push(Math.round(elementos[i].nota * 100) / 100);
	}

	return {
		labels: nombres,
		datasets: [
			{
				label: "Calificación",
				data: valores,
				backgroundColor: [
					'rgba(255, 215, 0, 0.8)',
					'rgba(192, 192, 192, 0.8)',
					'rgba(205, 127, 50, 0.8)',
					'rgba(0, 0, 0, 0.8)',
					'rgba(0, 0, 0, 0.8)'
				]
			}
		]
	};
}

/*******************************************************************************
 * Controlador
 *******************************************************************************/

QualiteacherApp.controller('detalleUniversidadController', function ($scope)
{
	$scope.universidad = {};
	$scope.top_carreras = {};
	$scope.top_profesores = {};
	var dataset_carreras = []
	var dataset_profesores = []

	$scope.init = function (universidad)
	{
		$scope.universidad = JSON.parse(universidad);
	}

	$(document).ready(function ()
	{
		dataset_carreras = transformaADatasetParaGrafica($scope.universidad.carreras);
		dataset_profesores = transformaADatasetParaGrafica($scope.universidad.profesores);

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
				},
				onClick: function(event, active_elements) { window.location.assign('/carreras/'+$scope.universidad.carreras[active_elements[0]._index]._id);}
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
				},
				onClick: function(event, active_elements) { window.location.assign('/profesores/'+$scope.universidad.profesores[active_elements[0]._index]._id);}
			}
		});
	})
});
