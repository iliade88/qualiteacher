var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProfesoresSchema = new Schema({
	_id : String,
	nombre: String,
	nota: Number,
	num_notas_pp: [[Number]],
	num_votos: Number,
	notas_asignaturas_prof: [{
		asignatura : { type: String, ref: 'Asignaturas' },
		nota_asignatura: Number,
		num_notas_pp: [[Number]],
		num_votos: Number
	}],
	universidad: { type: String, ref: 'Universidades' }
});

mongoose.model('Profesores', ProfesoresSchema);