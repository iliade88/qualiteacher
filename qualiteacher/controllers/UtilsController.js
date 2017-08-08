

exports.generaMatrizRecuentoNotasPorPregunta = function()
{
	var recuento_notas_por_pregunta = [10];
	//Inicializamos el array a 0
	for (var i = 0; i < 10; i++)
	{
		recuento_notas_por_pregunta[i] = new Array(11);

		for (var j = 0; j <= 10; j ++)
		{
			recuento_notas_por_pregunta[i][j] = 0;
		}
	}

	return recuento_notas_por_pregunta;
}

exports.buscaAsignatura = function(array, id_asignatura)
{
	for (var i = 0; i < array.length; i++)
	{
		if (""+array[i].asignatura === ""+id_asignatura) return i;
	}
	return -1;
};

/**
 * Cuenta las veces que se ha dado una calificación y aumenta el número de votos
 * @param num_notas_pp
 * @param num_votos
 * @param calificacion
 */
exports.sumaVotoANumNotasPP = function(num_notas_pp, num_votos, calificacion)
{
	for (var i = 0; i < calificacion.length; i++)
	{
		var nota_pregunta = calificacion[i];
		num_notas_pp[i][nota_pregunta]++;
	}
	num_votos++;
}

/**
 * Calcula la nota final
 * @param num_notas_pp: Matriz con el conteo de notas por pregunta
 * @param num_votos: Número de veces que se ha votado el par profesor/asignatura
 * @returns {number}: Nota final (del profesor o de la asignatura para ese profesor)
 */
exports.recalculaNota = function(num_notas_pp, num_votos)
{
	var nota = 0;

	for (var i = 0; i < num_notas_pp.length; i++)
	{
		var suma_pregunta = 0;
		for (var j = 0; j < num_notas_pp[i].length; j++)
		{
			suma_pregunta += (num_notas_pp[i][j] * j) / num_votos;
		}

		nota += (suma_pregunta / 10);
	}

	return nota;
};

exports.addNumNotasPP = function(num_notas_pp, num_votos, num_notas_pp_add, num_votos_add)
{
	for (var i = 0; i < num_notas_pp.length; i++)
	{
		for (var j = 0; j < num_notas_pp[i].length; j++)
		{
			num_notas_pp[i][j] += num_notas_pp_add[i][j];
		}
	}
	num_votos += num_votos_add
}