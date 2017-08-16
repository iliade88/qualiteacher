var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var Schema = mongoose.Schema;

var UsuariosSchema = new Schema({
	_id: String,
	nick: String,
	email: String,
	contrasenya: String,
	token: String,
	universidad: { type: String, ref: 'Universidades', required: true },
	votos: [{
		profesor: { type: String, ref: 'Profesores' },
		asignatura: { type: String, ref: 'Asignaturas' }
	}],
	token_activacion: String,
	token_rec_contrasenya: {type: String, default: "", required: true},
	activado: {type: Number, default: 0, required: true}
});

mongoose.model('Usuarios', UsuariosSchema);