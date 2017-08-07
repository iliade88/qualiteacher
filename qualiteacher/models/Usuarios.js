var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var Schema = mongoose.Schema;

var UsuariosSchema = new Schema({
	nick: String,
	email: String,
	contrasenya: String,
	universidad: { type: Schema.Types.ObjectId, ref: 'Universidades', required: true },
	votos: [{
		profesor: { type: Schema.Types.ObjectId, ref: 'Profesores' },
		asignatura: { type: Schema.Types.ObjectId, ref: 'Asignaturas' }
	}]
});

mongoose.model('Usuarios', UsuariosSchema);