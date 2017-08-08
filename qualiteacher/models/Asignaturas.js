var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AsignaturasSchema = new Schema({
    _id: String,
    nombre: String,
    codigo: String,
    descripcion: String,
    nota: Number,
    num_notas_pp: [[Number]],
    num_votos: Number,
	universidad: { type: String, ref: 'Universidades' },
    carrera: { type: String, ref: 'Carreras' },
    profesores: [{ type: String, ref: 'Profesores' }]
});

mongoose.model('Asignaturas', AsignaturasSchema);