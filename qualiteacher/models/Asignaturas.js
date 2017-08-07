var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AsignaturasSchema = new Schema({
    nombre: String,
    codigo: String,
    descripcion: String,
    nota: Number,
    num_notas_pp: [[Number]],
    num_votos: Number,
	universidad: { type: Schema.Types.ObjectId, ref: 'Universidades' },
    carrera: { type: Schema.Types.ObjectId, ref: 'Carreras' },
    profesores: [{ type: Schema.Types.ObjectId, ref: 'Profesores' }]
});

mongoose.model('Asignaturas', AsignaturasSchema);