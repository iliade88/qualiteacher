var express = require('express');
var router = express.Router();

var UniversidadesController = require('../controllers/UniversidadesController.js');

/* GET - Vista detalle universidad */
router.get('/:universidad', UniversidadesController.detalleUniversidad);

module.exports = router;
