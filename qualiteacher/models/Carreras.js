var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CarrerasSchema = new Schema({
	_id: String,
	nombre: String,
	codigo: String,
	nota: Number,
	num_notas_pp: [[Number]],
	num_votos: Number,
	asignaturas: [{ type: String, ref: 'Asignaturas' }],
	universidad: { type: String, ref: 'Universidades' }
});

mongoose.model('Carreras', CarrerasSchema);