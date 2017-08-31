var QualiteacherApp = angular.module("Qualiteacher");

QualiteacherApp.controller('registroController', function($scope, $http, $location) {

	$scope.formData = {};
	//Array de universidades que se mostrará en el select
	$scope.universidades = [];
	
	$(document).ready(function(){

		$http.get('/universidades')
		.then(function(response){

			//Cargamos todas universidades para mostrarlas en el select
			for (pos in response.data)
			{
				$scope.universidades.push(response.data[pos]);
			}

			$scope.formData.universidad = $scope.universidades[0];

		});	
	});

	$scope.submitForm = function (datos) {
		
		$http
		.post("/usuarios",
			{
				nickname: datos.nickname,
				email: datos.email,
				contrasenya: datos.contrasenya,
				universidad: datos.universidad._id
			})
		.then(
			function (response)
			{
				window.location.href="/registro-completado"
			},
			function (response) {
				alert("El usuario ya existe")
			});
	};

	$scope.validarEmailUniversidad = (function ()
	{
		var regexp = /^(.*)$/
		return {
			test: function(value)
			{
				regexp = eval("/^(.{3,}"+$scope.formData.universidad.dominio_email_alumnos+")$/")
				return regexp.test(value);
			}
		};
	})();
})
.directive("validarContrasenya", function() {
	return {
		restrict: 'A', //Para que sólo funcione como atributo
		require: '?ngModel',
		link: function(scope, elem, attrs, ngModel) 
		{
			if (!ngModel) return;

			// watch para reevaluar con los cambios el propio elemento
			scope.$watch(attrs.ngModel, function() {
				validar();
			});

			// observe para reevaluar con los cambios del otro elemento
			attrs.$observe('validarContrasenya', function(val) {
				validar();
			});

			var validar = function() {

				var val1 = ngModel.$viewValue;
				var val2 = attrs.validarContrasenya;

				// Establecer $validity 
				ngModel.$setValidity('validarContrasenya', val1 === val2);
			};
		}
	}
});