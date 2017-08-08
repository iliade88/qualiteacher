var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var Schema = mongoose.Schema;

var UsuariosSchema = new Schema({
	_id: String,
	nick: String,
	email: String,
	contrasenya: String,
	universidad: { type: String, ref: 'Universidades', required: true },
	votos: [{
		profesor: { type: String, ref: 'Profesores' },
		asignatura: { type: String, ref: 'Asignaturas' }
	}]
});

mongoose.model('Usuarios', UsuariosSchema);