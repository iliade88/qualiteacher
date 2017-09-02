var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NotaAsignaturaSchema = new Schema({
	asignatura : { type: String, ref: 'Asignaturas' },
	nota_asignatura: Number,
	num_notas_pp: [[Number]],
	num_votos: Number
}, {_id: false});

var ProfesoresSchema = new Schema({
	_id : String,
	nombre: String,
	nota: Number,
	avatar: String,
	num_notas_pp: [[Number]],
	num_votos: Number,
	notas_asignaturas_prof: [NotaAsignaturaSchema],
	universidad: { type: String, ref: 'Universidades' }
});

mongoose.model('Profesores', ProfesoresSchema);