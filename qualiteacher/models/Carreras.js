var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CarrerasSchema = new Schema({
	nombre: String,
	codigo: String,
	asignaturas: { type: Schema.Types.ObjectId, ref: 'Asignaturas' }
});

mongoose.model('Carreras', CarrerasSchema);