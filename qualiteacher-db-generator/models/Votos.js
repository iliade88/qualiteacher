var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VotosSchema = new Schema({
	cuestionario: [Number],
	profesor: { type: Schema.Types.ObjectId, ref: 'Profesores' },
	asignatura: { type: Schema.Types.ObjectId, ref: 'Asignaturas' }
});

mongoose.model('Votos', VotosSchema);