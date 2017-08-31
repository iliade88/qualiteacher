var QualiteacherApp = angular.module("Qualiteacher");

QualiteacherApp.controller('calificarController', function($scope, $http, $localStorage) {

	$scope.profesor = {}
	$scope.formData = {};
	$scope.asignaturas = []

	$scope.init = function (profesor) {
		$scope.profesor = JSON.parse(profesor);
		$scope.formData.profesor = $scope.profesor._id;

		for (var i = 0; i < $scope.profesor.notas_asignaturas_prof.length; i++)
		{
			$scope.asignaturas.push($scope.profesor.notas_asignaturas_prof[i].asignatura)
		}
		$scope.formData.asignatura = $scope.asignaturas[0];
		$scope.formData.pr1 = -1
		$scope.formData.pr2 = -1
		$scope.formData.pr3 = -1
		$scope.formData.pr4 = -1
		$scope.formData.pr5 = -1
		$scope.formData.pr6 = -1
		$scope.formData.pr7 = -1
		$scope.formData.pr8 = -1
		$scope.formData.pr9 = -1
		$scope.formData.pr10 = -1
	};

	$scope.transformaSinOpinion = function (nota) {
		if (nota == -1)
			return 5;
		else
			return nota;
	};

	$scope.submitForm = function (datos) {

		var url = "/profesores/" + datos.profesor + "/" + datos.asignatura._id + "/calificar";

		/* Si se ha seleccionado "Sin opinión" cambiamos el valor -1 por un 5 para hacer neutral la respuesta. */
		datos.pr1 = $scope.transformaSinOpinion(datos.pr1);
		datos.pr2 = $scope.transformaSinOpinion(datos.pr2);
		datos.pr3 = $scope.transformaSinOpinion(datos.pr3);
		datos.pr4 = $scope.transformaSinOpinion(datos.pr4);
		datos.pr5 = $scope.transformaSinOpinion(datos.pr5);
		datos.pr6 = $scope.transformaSinOpinion(datos.pr6);
		datos.pr7 = $scope.transformaSinOpinion(datos.pr7);
		datos.pr8 = $scope.transformaSinOpinion(datos.pr8);
		datos.pr9 = $scope.transformaSinOpinion(datos.pr9);
		datos.pr10 = $scope.transformaSinOpinion(datos.pr10);

		var universidadUsuario = $localStorage.usuarioQualiteacher || undefined;

		if (universidadUsuario === undefined) {
			alert("Debes acceder con tu cuenta para poder votar.");
		}
		else if ($scope.profesor.universidad.localeCompare(universidadUsuario.universidad) === 0) {
			$http
				.post(url,
					{
						pr1: datos.pr1,
						pr2: datos.pr2,
						pr3: datos.pr3,
						pr4: datos.pr4,
						pr5: datos.pr5,
						pr6: datos.pr6,
						pr7: datos.pr7,
						pr8: datos.pr8,
						pr9: datos.pr9,
						pr10: datos.pr10,
						anonimo: datos.anonimo,
						usuario: universidadUsuario.nick
					},
					{
						headers: {
							'Authorization': 'Bearer '+universidadUsuario.token
						}
					})
				.then(
					function (response) {
						alert("Calificación registrada");
					},
					function (response) {

						if(response.data.error)
						{
							alert(response.data.error);
						}
						else alert("Ocurrió un error, inténtalo de nuevo más tarde")
					});
		}
		else {
			alert("No puedes votar a este profesor porque no pertenece a tu universidad.");
		}
	}
});