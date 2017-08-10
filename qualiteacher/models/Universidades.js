var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UniversidadesSchema = new Schema({
	_id: String,
	nombre: String,
	comunidad: String,
	nota: Number,
	num_votos: Number,
	dominio_email_alumnos: String,
	alumnos: [{ type: String, ref: 'Usuarios'}],
	profesores: [{ type: String, ref: 'Profesores'}],
	carreras: [{ type: String, ref: 'Carreras'}]
});

mongoose.model('Universidades', UniversidadesSchema);