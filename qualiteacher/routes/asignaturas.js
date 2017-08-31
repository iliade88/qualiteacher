var express = require('express');
var router = express.Router();

var AsignaturasController= require('../controllers/AsignaturasController.js');

/* GET - Obtiene los datos de la asignatura y los muestra. */
router.get('/:asignatura', AsignaturasController.detalleAsignatura)

module.exports = router;