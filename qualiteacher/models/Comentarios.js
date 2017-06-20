var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ComentariosSchema = new Schema({
	comentario: String,
	usuario: { type: Schema.Types.ObjectId, ref: 'Usuarios' }
});

mongoose.model('Comentarios', ComentariosSchema);