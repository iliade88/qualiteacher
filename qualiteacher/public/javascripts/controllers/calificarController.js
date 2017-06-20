var QualiteacherApp = angular.module("Qualiteacher", ['ngMessages']);

QualiteacherApp.controller('calificarController', function($scope, $http) {

	$scope.formData = {};
	$scope.asignaturas = []

	$scope.init = function () {
		$scope.formData.profesor = window.profesor._id;
		$scope.formData.asignatura = window.profesor.asignaturas[0];
		$scope.asignaturas = window.profesor.asignaturas;
	};

	$scope.transformaSinOpinion = function (nota) {
		if (nota == -1)
			return 5;
		else
			return nota;
	};

	$scope.submitForm = function (datos) {

		console.log(JSON.stringify(datos));

		var url = "/profesores/"+datos.profesor+"/"+datos.asignatura._id+"/calificar";

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
					usuario: datos.usuario
				})
			.then(
				function (response)
				{
					alert("Calificación registrada");
					console.log(response)
				},
				function (response) {
					alert("Ocurrió un error, inténtelo de nuevo más tarde");
					console.log(response)
				});
	};

});