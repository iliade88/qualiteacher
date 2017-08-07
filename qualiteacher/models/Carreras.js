var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CarrerasSchema = new Schema({
	nombre: String,
	codigo: String,
	nota: Number,
	num_notas_pp: [[Number]],
	num_votos: Number,
	asignaturas: [{ type: Schema.Types.ObjectId, ref: 'Asignaturas' }],
	universidad: { type: Schema.Types.ObjectId, ref: 'Universidades' }
});

mongoose.model('Carreras', CarrerasSchema);