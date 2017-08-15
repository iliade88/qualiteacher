var express = require('express');
var router = express.Router();

var ProfesoresController = require('../controllers/ProfesoresController.js');
var AuthController = require('../controllers/AuthController.js');

/* GET - lista profesores */
router.get('/', ProfesoresController.findAll);

/* GET - Vista detalle profesor */
router.get('/:profesor', ProfesoresController.detalleProfesor);

/* GET - Vista calificar profesor */
router.get('/:profesor/calificar', AuthController.ensureAuthenticated, ProfesoresController.vistaCalificar);

/* POST - Calificar un profesor */
router.post('/:profesor/:asignatura/calificar', AuthController.ensureAuthenticated, ProfesoresController.calificarProfesor);

module.exports = router;