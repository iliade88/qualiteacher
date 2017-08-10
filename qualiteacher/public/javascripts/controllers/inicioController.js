var QualiteacherApp = angular.module("Qualiteacher", ['ngMessages', 'ui.bootstrap']);


function formateaResultadosParaTypeahead(resultados)
{
	var resultados_formateados = [];
	var resultados_universidades = resultados.universidades.map(function (item) { return item.nombre } );
	var resultados_carreras = resultados.carreras.map(function (item) { return item.codigo + " - " +item.nombre } );
	var resultados_asignaturas = resultados.asignaturas.map(function (item) { return item.codigo + " - " +item.nombre } )
	var resultados_profesores = resultados.profesores.map(function (item) { return item.nombre } )

	resultados_formateados.push.apply(resultados_formateados, resultados_universidades);
	resultados_formateados.push.apply(resultados_formateados, resultados_carreras)
	resultados_formateados.push.apply(resultados_formateados, resultados_asignaturas)
	resultados_formateados.push.apply(resultados_formateados, resultados_profesores)

	return resultados_formateados;
}

function objetosResultadosParaTypeahead(resultados)
{
	var resultados_formateados = [];

	resultados.universidades = resultados.universidades.map(function (item) { item['tipo'] = 'universidades'; return item } );
	resultados.carreras = resultados.carreras.map(function (item) { item['tipo'] = 'carreras'; return item } );
	resultados.asignaturas = resultados.asignaturas.map(function (item) { item['tipo'] = 'asignaturas'; return item } )
	resultados.profesores = resultados.profesores.map(function (item) { item['tipo'] = 'profesores'; return item } )

	resultados_formateados.push.apply(resultados_formateados, resultados.universidades);
	resultados_formateados.push.apply(resultados_formateados, resultados.carreras)
	resultados_formateados.push.apply(resultados_formateados, resultados.asignaturas)
	resultados_formateados.push.apply(resultados_formateados, resultados.profesores)

	return resultados_formateados;
}

QualiteacherApp.controller('inicioController', function($scope, $http) {

	$scope.texto_buscar = "";

	$scope.init = function()
	{
		//Creamos los datos
		var datos = [
			{"nombre": "UA", "satisfaccion": 456},
			{"nombre": "UMH", "satisfaccion": 479},
			{"nombre": "UCM", "satisfaccion": 324},
			{"nombre": "UCAM", "satisfaccion": 569}
		]
		//Ordenamos el vector para que salgan en orden
		datos.sort(function (a, b) {
			return b.satisfaccion - a.satisfaccion
		});
		var abreviaturas = [];
		var satisfaccion = [];
		//Creamos los 2 vectores, el de datos y el de etiquetas
		for (uni in datos) {
			abreviaturas.push(datos[uni].nombre);
			satisfaccion.push(datos[uni].satisfaccion);
		}
		var bardata = {
			labels: abreviaturas,
			datasets: [
				{
					label: "Satisfaccion",
					backgroundColor: ["#999900", "#c0c0c0", "#996633", "#fff"],
					borderColor: ["#000", "#000", "#000", "#000"],
					borderWidth: 2,
					data: satisfaccion
				}
			]
		}
		var rankunis = document.getElementById('ranking-universidades').getContext('2d');
		var chart = new Chart(rankunis, {
			type: 'horizontalBar',
			data: bardata,
			options: {
				responsive: true,
				maintainAspectRatio: true,
				legend: {
					display: false
				}
			}
		});

		//Creamos los datos
		var datos = [
			{"nombre": "Manuel Quintero - CI - UA", "satisfaccion": 456},
			{"nombre": "Carolina Cerezuela - ASD - UMH", "satisfaccion": 479},
			{"nombre": "Héctor Barrachina - LGD - UCM", "satisfaccion": 324},
			{"nombre": "Rosa Pastor - TFG - UCAM", "satisfaccion": 569}
		]
		//Ordenamos el vector para que salgan en orden
		datos.sort(function (a, b) {
			return b.satisfaccion - a.satisfaccion
		});
		var abreviaturas = [];
		var satisfaccion = [];
		//Creamos los 2 vectores, el de datos y el de etiquetas
		for (uni in datos) {
			abreviaturas.push(datos[uni].nombre);
			satisfaccion.push(datos[uni].satisfaccion);
		}
		var bardata = {
			labels: abreviaturas,
			datasets: [
				{
					label: "Satisfaccion",
					backgroundColor: ["#999900", "#c0c0c0", "#996633", "#fff"],
					borderColor: ["#000", "#000", "#000", "#000"],
					borderWidth: 2,
					data: satisfaccion
				}
			]
		}
		var rankunis = document.getElementById('ranking-profesores').getContext('2d');
		var chart = new Chart(rankunis, {
			type: 'horizontalBar',
			data: bardata,
			options: {
				responsive: true,
				maintainAspectRatio: true,
				legend: {
					display: false
				}
			}
		});
	}

	$scope.resultados_busqueda = [];
	$scope.resultado_seleccionado = {};

	$(document).ready(function () {
		$("#campo-buscador").typeahead({
			source: function (query, process) {
				$http
					.get("/buscar/"+query)
					.then(function(response)
					{
						$scope.resultados_busqueda = objetosResultadosParaTypeahead(response.data);

						process($scope.resultados_busqueda)
					},
					function (error)
					{
						console.log(error)
					});
			},
			updater: function (item) {
				window.location.assign('/'+item.tipo+'/'+item._id);
			},
			matcher: function (item) {
				if (item.nombre.toLowerCase().indexOf(this.query.trim().toLowerCase()) !== -1)
					return true;
			},
			sorter: function (items) {
				return items.sort(function(a,b) { return a.nombre.localeCompare(b.nombre) });
			},
			highlighter: function (item)
			{
				return '<p>'+item.nombre+' - '+item.nota+'</p>';
			}
		});
	});

	$scope.buscar = function(valor) {
		console.log("Buscamos: "+valor);

		var texto_urlencoded = encodeURI(valor)
		return $http
			.get("/buscar/"+texto_urlencoded)
			.then(
				function (response)
				{
					console.log("respuesta");
					console.log(response);
					$scope.resultados_busqueda = response.data;
					return formateaResultadosParaTypeahead(response.data);
				},
				function (response) {
					console.log("No se han encontrado resultados -> "+response)
				});
	}
});