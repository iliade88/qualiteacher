var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProfesoresSchema = new Schema({
	nombre: String,
	nick: String,
	nota: Number,
	num_notas_pp: [[Number]],
	num_votos: Number,
	notas_asignaturas_prof: [{
		asignatura : { type: Schema.Types.ObjectId, ref: 'Asignaturas' },
		nota_asignatura: Number,
		num_nota_pp: [[Number]],
		num_votos: Number
	}],
	universidad: { type: Schema.Types.ObjectId, ref: 'Universidad' }
});

mongoose.model('Profesores', ProfesoresSchema);