var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UniversidadesSchema = new Schema({
	nombre: String,
	comunidad: String,
	nota: Number,
	num_votos: Number,
	dominio_email_alumnos: String,
	alumnos: [{ type: Schema.Types.ObjectId, ref: 'alumnos'}],
	profesores: [{ type: Schema.Types.ObjectId, ref: 'Profesores'}],
	carreras: [{ type: Schema.Types.ObjectId, ref: 'Carreras'}]
});

mongoose.model('Universidades', UniversidadesSchema);