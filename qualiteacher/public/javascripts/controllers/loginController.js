var QualiteacherApp = angular.module("Qualiteacher");

QualiteacherApp.controller('loginController', function($scope, $http, $location, $localStorage) {

	$scope.username = "";
	$scope.contrasenya = "";
	$scope.usuarioActual = {};

	$(document).ready(function()
	{
		$scope.usuarioActual = $localStorage.usuarioQualiteacher;
	})

	$scope.login = function ()
	{
		if ($scope.username.localeCompare("") !== 0 && !$scope.contrasenya.localeCompare("") !== 0)
		{
			$http
				.post('/usuarios/login', {nickname: $scope.username, contrasenya: $scope.contrasenya})
				.then(
					function (response)
					{
						console.log(response);
						$localStorage.usuarioQualiteacher = response.data.usuario;
						$http.defaults.headers.common.Authorization = 'Bearer ' + response.data.usuario.token;
						window.location.replace('/')
					},
					function (err)
					{
						console.log(err);
						var error_html = "<div class='alert alert-danger alert-dismissable fade in col-lg-offset-3 col-lg-6'>"
											+ "<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>"
											+ "<strong>¡Error!</strong> " + err.data.error
										+ "</div>"
						$('#error-div').html(error_html);
					}
				);
		}
	}
});