var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AsignaturasSchema = new Schema({
    nombre: String,
    codigo: String,
    descripcion: String,
    carrera: { type: Schema.Types.ObjectId, ref: 'Universidad' },
    profesores: [{ type: Schema.Types.ObjectId, ref: 'Profesores' }]
});

mongoose.model('Asignaturas', AsignaturasSchema);