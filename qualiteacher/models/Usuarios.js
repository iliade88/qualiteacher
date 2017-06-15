var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var Schema = mongoose.Schema;
var Autor = mongoose.model('Universidades');

var UsuariosSchema = new Schema({
	nick: String,
	email: String,
	universidad: { type: Schema.Types.ObjectId, ref: 'Universidades', required: true },
	contrasenya: String
});

mongoose.model('Usuarios', UsuariosSchema);