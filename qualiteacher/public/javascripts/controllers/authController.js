var QualiteacherApp = angular.module("Qualiteacher");

QualiteacherApp.controller('authController', function($scope, $http, $localStorage) {

	$scope.usuarioActual = $localStorage.usuarioQualiteacher;
	$scope.usuarioLogueado = !!$scope.usuarioActual;

	$scope.muestraUsuario = function()
	{
		console.log("Usuario actual")
		console.log($scope.usuarioActual);
	}

	$scope.logout = function()
	{
		delete $localStorage.usuarioQualiteacher;
		$http.defaults.headers.common.Authorization = '';
		$scope.usuarioLogueado = false;
	}
});