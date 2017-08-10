var express = require('express');
var router = express.Router();

var UniversidadesController = require('../controllers/UniversidadesController.js');

/* GET - lista universidades */
router.get('/', UniversidadesController.findAll);

/* GET - Vista detalle universidad */
router.get('/:universidad', UniversidadesController.detalleUniversidad);

/* GET - Vista detalle universidad */
router.get('/buscar/:cadena', UniversidadesController.buscarUniversidad);

module.exports = router;
