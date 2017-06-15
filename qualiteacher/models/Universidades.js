var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UniversidadesSchema = new Schema({
	nombre: String,
	comunidad: String,
	dominio_email_alumnos: String,
	dominio_email_profesores: String,
	alumnos: [{ type: Schema.Types.ObjectId, ref: 'alumnos'}],
	profesores: [{ type: Schema.Types.ObjectId, ref: 'profesores'}]
});

mongoose.model('Universidades', UniversidadesSchema);