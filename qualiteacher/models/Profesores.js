var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProfesoresSchema = new Schema({
	nombre: String,
	universidad: { type: Schema.Types.ObjectId, ref: 'Universidad' },
	nick: String,
	email: String,
	contrasenya: String
});

mongoose.model('Profesores', ProfesoresSchema);