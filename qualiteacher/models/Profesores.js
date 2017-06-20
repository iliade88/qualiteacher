var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProfesoresSchema = new Schema({
	nombre: String,
	nick: String,
	email: String,
	contrasenya: String,
    universidad: { type: Schema.Types.ObjectId, ref: 'Universidad' },
    asignaturas : [{ type: Schema.Types.ObjectId, ref: 'Asignaturas' }],
    votos: [{ type: Schema.Types.ObjectId, ref: 'Votos' }],
	comentarios: [{ type: Schema.Types.ObjectId, ref: 'Comentarios' }]
});

mongoose.model('Profesores', ProfesoresSchema);