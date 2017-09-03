var QualiteacherApp = angular.module("Qualiteacher", ['ngMessages', 'ui.bootstrap', 'ngStorage']);

Chart.defaults.global.defaultFontColor = '#000000';

function formateaResultadosParaTypeahead(resultados) {
	var resultados_formateados = [];
	var resultados_universidades = resultados.universidades.map(function (item) {
		return item.nombre
	});
	var resultados_carreras = resultados.carreras.map(function (item) {
		return item.codigo + " - " + item.nombre
	});
	var resultados_asignaturas = resultados.asignaturas.map(function (item) {
		return item.codigo + " - " + item.nombre
	})
	var resultados_profesores = resultados.profesores.map(function (item) {
		return item.nombre
	})

	resultados_formateados.push.apply(resultados_formateados, resultados_universidades);
	resultados_formateados.push.apply(resultados_formateados, resultados_carreras)
	resultados_formateados.push.apply(resultados_formateados, resultados_asignaturas)
	resultados_formateados.push.apply(resultados_formateados, resultados_profesores)

	return resultados_formateados;
}

function objetosResultadosParaTypeahead(resultados) {
	var resultados_formateados = [];

	resultados.universidades = resultados.universidades.map(function (item) {
		item['ico'] = '/images/glyphicons/glyphicon-universidad.png';
		item['tipo'] = 'Universidades';
		return item
	});
	resultados.carreras = resultados.carreras.map(function (item) {
		item['ico'] = '/images/glyphicons/glyphicon-carrera.png';
		item['tipo'] = 'Carreras';
		return item
	});
	resultados.asignaturas = resultados.asignaturas.map(function (item) {
		item['ico'] = '/images/glyphicons/glyphicon-asignatura.png';
		item['tipo'] = 'Asignaturas';
		return item
	});
	resultados.profesores = resultados.profesores.map(function (item) {
		item['ico'] = '/images/glyphicons/glyphicon-profesor.png';
		item['tipo'] = 'Profesores';
		return item
	});

	resultados_formateados.push.apply(resultados_formateados, resultados.universidades);
	resultados_formateados.push.apply(resultados_formateados, resultados.carreras)
	resultados_formateados.push.apply(resultados_formateados, resultados.asignaturas)
	resultados_formateados.push.apply(resultados_formateados, resultados.profesores)

	return resultados_formateados;
}

function templateSegunTipo(item) {
	var template = '<div class="item_resultado_buscador">'
		+ '<img style="display: inline-block" src="' + item.ico + '" title="' + item.tipo + '"/> '
		+ '<p style="display: inline-block; padding-left: 5px;" >' + item.nombre;

	if (item.tipo.localeCompare('Carreras') === 0 || item.tipo.localeCompare('Profesores') === 0) {
		template += ' - ' + item.universidad.nombre;
	}
	else if (item.tipo.localeCompare('Asignaturas') === 0) {
		template += ' - ' + item.carrera.nombre + ' - ' + item.universidad.nombre;
	}

	template += '</p></div>';

	return template;
}

function transformaADatasetParaGraficaTopConNombreUniversidad(elementos)
{
	var nombres = [];
	var valores = [];

	for (var i in elementos)
	{
		nombres.push(elementos[i].nombre + ' - ' + elementos[i].nombre_universidad);
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

function transformaADatasetParaGraficaTopConNombreUniversidadYCarrera(elementos)
{
	var nombres = [];
	var valores = [];

	for (var i in elementos)
	{
		nombres.push(elementos[i].nombre + ' - ' + elementos[i].nombre_carrera + ' - ' + elementos[i].nombre_universidad);
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

QualiteacherApp.controller('inicioController', function ($scope, $http) {

	$scope.texto_buscar = "";
	$scope.top = {}
	$scope.init = function (top) {
		$scope.top = JSON.parse(top)[0]

		$scope.top.datasetUniversidades = transformaADatasetParaGrafica($scope.top.universidades);
		$scope.top.datasetCarreras = transformaADatasetParaGraficaTopConNombreUniversidad($scope.top.carreras);
		$scope.top.datasetAsignaturas = transformaADatasetParaGraficaTopConNombreUniversidadYCarrera($scope.top.asignaturas);
		$scope.top.datasetProfesores = transformaADatasetParaGraficaTopConNombreUniversidad($scope.top.profesores);


	};

	$scope.resultados_busqueda = [];
	$scope.resultado_seleccionado = {};

	$scope.creaGrafica = function (contexto, dataset, tipo, array_objs)
	{
		new Chart(contexto, {
			type: 'horizontalBar',
			data: dataset,
			options: {
				responsive: true,
				legend: {
					display: false
				},
				scales: {
					gridLines: {
						color: "white"
					},
					xAxes: [
						{
							ticks: {
								fontColor: "white",
								beginAtZero: true,
								max: 10
							}}
					],
					yAxes: [{
						fontColor: "white",
						stacked: true
					}]
				},
				onClick: function(event, active_elements) { window.location.assign('/'+tipo+'/'+array_objs[active_elements[0]._index]._id);}
			}
		});
	}

	$(document).ready(function () {
		/*********************************
		 ********** TypeAhead ************
		 *********************************/
		$("#campo-buscador").typeahead({
			source: function (query, process) {
				$http
					.get("/buscar/" + query)
					.then(function (response) {
							$scope.resultados_busqueda = objetosResultadosParaTypeahead(response.data);

							process($scope.resultados_busqueda)
						},
						function (error) {
							console.log(error)
						});
			},
			updater: function (item) {
				window.location.assign('/' + item.tipo.toLowerCase() + '/' + item._id);
			},
			matcher: function (item) {
				if (item.nombre.toLowerCase().indexOf(this.query.trim().toLowerCase()) !== -1)
					return true;
			},
			sorter: function (items) {
				return items.sort(function (a, b) {
					var tipo = a.tipo.localeCompare(b.tipo);
					if (tipo === 0)
						return a.nombre.localeCompare(b.nombre);
					return tipo;
				});
			},
			highlighter: function (item) {
				return templateSegunTipo(item)
			}
		});

		/*********************************************
		 ********** Ranking Universidades ************
		 *********************************************/
		var canvas_universidades = document.getElementById('ranking-universidades');
		var contexto_canvas_universidades = canvas_universidades.getContext('2d');
		$scope.creaGrafica(contexto_canvas_universidades, $scope.top.datasetUniversidades, 'universidades', $scope.top.universidades);

		var canvas_carreras = document.getElementById('ranking-carreras');
		var contexto_canvas_carreras = canvas_carreras.getContext('2d');
		$scope.creaGrafica(contexto_canvas_carreras, $scope.top.datasetCarreras, 'carreras', $scope.top.carreras);

		var canvas_asignaturas = document.getElementById('ranking-asignaturas');
		var contexto_canvas_asignaturas = canvas_asignaturas.getContext('2d');
		$scope.creaGrafica(contexto_canvas_asignaturas, $scope.top.datasetAsignaturas, 'asignaturas', $scope.top.asignaturas);

		var canvas_profesores = document.getElementById('ranking-profesores');
		var contexto_canvas_profesores = canvas_profesores.getContext('2d');
		$scope.creaGrafica(contexto_canvas_profesores, $scope.top.datasetProfesores, 'profesores', $scope.top.profesores);
	});

	$scope.buscar = function (valor) {
		var texto_urlencoded = encodeURI(valor)
		return $http
			.get("/buscar/" + texto_urlencoded)
			.then(
				function (response) {
					$scope.resultados_busqueda = response.data;
					return formateaResultadosParaTypeahead(response.data);
				},
				function (error) {
					console.log(error)
				});
	}
});