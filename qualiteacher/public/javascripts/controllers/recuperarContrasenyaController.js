var QualiteacherApp = angular.module("Qualiteacher");

QualiteacherApp.controller('recuperarContrasenyaController', function($scope, $http) {

	$scope.email = ""
	$scope.token = "";

	$scope.init = function(token)
	{
		$scope.token = token;
	}

	$scope.submitForm = function () {

		$http
			.post("/usuarios/email-recuperar-contrasenya",
			{
				email: $scope.email
			})
			.then(
				function (response)
				{
					alert(response.data.mensaje)
				},
				function (response) {
					alert(response.data.error)
				});
	};

	$scope.submitFormNuevaContrasenya = function(datos)
	{
		$http
			.post("/usuarios/nueva-contrasenya",
				{
					token: $scope.token,
					contrasenya: datos.contrasenya
				})
			.then(
				function (response)
				{
					window.location.replace('/usuarios/contrasenya-cambiada')
				},
				function (response) {
					alert(response.data.error)
				});
	}
});