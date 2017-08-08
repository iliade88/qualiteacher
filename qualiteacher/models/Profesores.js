var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProfesoresSchema = new Schema({
	_id : String,
	nombre: String,
	nick: String,
	nota: Number,
	num_notas_pp: [[Number]],
	num_votos: Number,
	notas_asignaturas_prof: [{
		asignatura : { type: String, ref: 'Asignaturas' },
		nota_asignatura: Number,
		num_nota_pp: [[Number]],
		num_votos: Number
	}],
	universidad: { type: String, ref: 'Universidad' }
});

mongoose.model('Profesores', ProfesoresSchema);