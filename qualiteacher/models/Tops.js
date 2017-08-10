var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Tops = new Schema({
	universidades : [{
		_id: { type: String, ref: 'Universidades'},
		nombre: String,
		nota: Number
	}],
	carreras : [{
		_id: { type: String, ref: 'Carreras'},
		nombre: String,
		nombre_universidad: String,
		nota: Number
	}],
	asignaturas : [{
		_id: { type: String, ref: 'Asignaturas'},
		nombre: String,
		nombre_universidad: String,
		nombre_carrera: String,
		nota: Number
	}],
	profesores : [{
		_id: { type: String, ref: 'Profesores'},
		nombre: String,
		nombre_universidad: String,
		nombre_carrera: String,
		nombre_asignatura: String,
		nota: Number
	}]
});

mongoose.model('Tops', TopsSchema);