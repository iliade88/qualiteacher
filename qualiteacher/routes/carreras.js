var express = require('express');
var router = express.Router();

var CarrerasController = require('../controllers/CarrerasController.js');

router.get('/', CarrerasController.findAll);

/* GET - Detalle carrera */
router.get('/:carrera', CarrerasController.detalleCarrera);

/* GET - Datos carrera */
router.get('/:carrera/datos', CarrerasController.datosCarrera);

module.exports = router;
